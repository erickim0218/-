import JSZip from 'jszip';
import { supabase } from './supabase';

export const RESULT_EVIDENCE_BUCKET = 'bootcamp-result-evidence';

export interface BootcampResultEvidence {
  case_key: string;
  category: string;
  profile: string;
  headline: string;
  quote: string;
  quote2?: string | null;
  summary: string;
  source: string;
  evidence_type: string;
  image_paths: string[];
  image_alt: string;
  is_featured: boolean;
  display_order: number;
  publication_consent_confirmed: boolean;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
  image_urls?: string[];
}

interface UploadReviewJson {
  id: string;
  featured?: boolean;
  category: string;
  profile: string;
  headline: string;
  quote: string;
  quote2?: string;
  summary: string;
  source: string;
  evidenceType: string;
  images: string[];
  publicationConsentConfirmed?: boolean;
  imageAlt?: string;
}

async function attachSignedUrls(rows: BootcampResultEvidence[]) {
  return Promise.all(rows.map(async (row) => {
    const imageUrls = await Promise.all((row.image_paths || []).map(async (path) => {
      const { data, error } = await supabase.storage.from(RESULT_EVIDENCE_BUCKET).createSignedUrl(path, 900);
      return error ? null : data.signedUrl;
    }));
    return { ...row, image_urls: imageUrls.filter((url): url is string => Boolean(url)) };
  }));
}

export async function fetchPublishedResultEvidence(): Promise<BootcampResultEvidence[]> {
  const { data, error } = await supabase
    .from('bootcamp_result_evidence')
    .select('*')
    .eq('publication_consent_confirmed', true)
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('display_order', { ascending: true });
  if (error || !data) return [];
  return attachSignedUrls(data as BootcampResultEvidence[]);
}

export async function fetchAdminResultEvidence(): Promise<BootcampResultEvidence[]> {
  const { data, error } = await supabase
    .from('bootcamp_result_evidence')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('display_order', { ascending: true });
  if (error) throw error;
  return attachSignedUrls((data || []) as BootcampResultEvidence[]);
}

export async function updateResultEvidenceReview(
  caseKey: string,
  updates: Pick<BootcampResultEvidence, 'publication_consent_confirmed' | 'is_published'>
) {
  if (updates.is_published && !updates.publication_consent_confirmed) {
    throw new Error('공개 동의를 먼저 확인해야 게시할 수 있습니다.');
  }
  const { error } = await supabase
    .from('bootcamp_result_evidence')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('case_key', caseKey);
  if (error) throw error;
}

export async function importResultEvidenceZip(file: File) {
  const zip = await JSZip.loadAsync(file);
  const jsonEntry = Object.values(zip.files).find((entry) => !entry.dir && entry.name.endsWith('/reviews.json'));
  if (!jsonEntry) throw new Error('ZIP 안에서 reviews.json을 찾을 수 없습니다.');
  const parsed = JSON.parse(await jsonEntry.async('text')) as { reviews?: UploadReviewJson[] };
  if (!Array.isArray(parsed.reviews) || parsed.reviews.length === 0) {
    throw new Error('reviews.json의 사례 데이터를 확인해 주세요.');
  }

  const existingRows = await fetchAdminResultEvidence();
  const existingByKey = new Map(existingRows.map((row) => [row.case_key, row]));
  const importedKeys = new Set(parsed.reviews.map((review) => review.id));
  const referencedFiles = parsed.reviews.flatMap((review) => review.images || []);
  if (new Set(referencedFiles).size !== referencedFiles.length) {
    throw new Error('서로 다른 사례에 같은 이미지 파일이 중복 연결되어 있습니다.');
  }

  let imageCount = 0;
  for (const [index, review] of parsed.reviews.entries()) {
    const imagePaths: string[] = [];
    for (const fileName of review.images || []) {
      const imageEntry = Object.values(zip.files).find((entry) => !entry.dir && entry.name.endsWith(`/${fileName}`));
      if (!imageEntry) throw new Error(`${fileName} 파일이 ZIP에 없습니다.`);
      const blob = await imageEntry.async('blob');
      const storagePath = `${review.id}/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from(RESULT_EVIDENCE_BUCKET)
        .upload(storagePath, blob, { upsert: true, cacheControl: '3600', contentType: 'image/webp' });
      if (uploadError) throw uploadError;
      imagePaths.push(storagePath);
      imageCount += 1;
    }

    const existing = existingByKey.get(review.id);
    const consentConfirmed = Boolean(existing?.publication_consent_confirmed);
    const payload: BootcampResultEvidence = {
      case_key: review.id,
      category: review.category,
      profile: review.profile,
      headline: review.headline,
      quote: review.quote,
      quote2: review.quote2 || null,
      summary: review.summary,
      source: review.source,
      evidence_type: review.evidenceType,
      image_paths: imagePaths,
      image_alt: review.imageAlt || review.headline,
      is_featured: Boolean(review.featured),
      display_order: index,
      // 기존에 관리자가 확인한 공개 동의는 최신 ZIP을 다시 가져와도 보존합니다.
      // 신규 사례는 항상 비공개·동의 미확인 상태로 시작합니다.
      publication_consent_confirmed: consentConfirmed,
      is_published: consentConfirmed && Boolean(existing?.is_published)
    };
    const { error: upsertError } = await supabase
      .from('bootcamp_result_evidence')
      .upsert(payload, { onConflict: 'case_key' });
    if (upsertError) throw upsertError;
  }

  // 최신 통합본에서 빠진 과거 사례는 삭제하지 않고 고객 화면 노출만 중단합니다.
  const excludedCaseKeys: string[] = [];
  for (const existing of existingRows) {
    if (importedKeys.has(existing.case_key)) continue;
    excludedCaseKeys.push(existing.case_key);
    if (existing.is_published) {
      const { error } = await supabase
        .from('bootcamp_result_evidence')
        .update({ is_published: false, updated_at: new Date().toISOString() })
        .eq('case_key', existing.case_key);
      if (error) throw error;
    }
  }

  return { caseCount: parsed.reviews.length, imageCount, excludedCaseKeys };
}
