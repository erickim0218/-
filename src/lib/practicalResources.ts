import { supabase } from './supabase';

export type PracticalResourceAccess = 'free' | 'pro';
export type PracticalResourceCategory =
  | 'career'
  | 'resume'
  | 'cover_letter'
  | 'portfolio'
  | 'interview'
  | 'job_change';

export interface PracticalResource {
  id: string;
  title: string;
  description: string;
  category: PracticalResourceCategory;
  access_level: PracticalResourceAccess;
  file_path: string | null;
  external_url: string | null;
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
  is_published: boolean;
  sort_order: number;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export const PRACTICAL_RESOURCE_BUCKET = 'practical-resources';

export const PRACTICAL_CATEGORY_LABELS: Record<PracticalResourceCategory, string> = {
  career: '커리어 방향',
  resume: '이력서',
  cover_letter: '자기소개서',
  portfolio: '포트폴리오',
  interview: '면접',
  job_change: '직무전환'
};

export async function fetchPracticalResources(options?: { includeUnpublished?: boolean }) {
  let query = supabase
    .from('practical_resources')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (!options?.includeUnpublished) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as PracticalResource[];
}

export async function getPracticalResourceUrl(resource: PracticalResource) {
  if (resource.external_url) return resource.external_url;
  if (!resource.file_path) throw new Error('연결된 파일이 없습니다.');

  const { data, error } = await supabase.storage
    .from(PRACTICAL_RESOURCE_BUCKET)
    .createSignedUrl(resource.file_path, 60 * 10, {
      download: resource.file_name || true
    });

  if (error || !data?.signedUrl) {
    throw error || new Error('파일 주소를 만들지 못했습니다.');
  }
  return data.signedUrl;
}

export async function getPracticalResourcePreviewUrl(resource: PracticalResource) {
  if (!resource.file_path) throw new Error('미리보기 파일이 없습니다.');
  const { data, error } = await supabase.storage
    .from(PRACTICAL_RESOURCE_BUCKET)
    .createSignedUrl(resource.file_path, 60 * 10);
  if (error || !data?.signedUrl) {
    throw error || new Error('미리보기 주소를 만들지 못했습니다.');
  }
  return data.signedUrl;
}

export async function recordPracticalResourceDownload(resourceId: string) {
  const { data, error } = await supabase.rpc('increment_practical_resource_download', {
    resource_id: resourceId
  });
  if (error) throw error;

  if (data) {
    const { error: notificationError } = await supabase.functions.invoke('notify-resource-download', {
      body: { downloadId: data }
    });
    if (notificationError) console.warn('Failed to send download notification:', notificationError);
  }
  return data as string | null;
}

export async function getMyMarketingConsent() {
  const { data, error } = await supabase.rpc('get_my_marketing_consent');
  if (error) throw error;
  return Boolean(data);
}

export async function setMyMarketingConsent(consented: boolean, source = 'resource_download') {
  const { error } = await supabase.rpc('set_my_marketing_consent', {
    consented,
    consent_source: source
  });
  if (error) throw error;
}

export interface PracticalResourceInput {
  title: string;
  description: string;
  category: PracticalResourceCategory;
  accessLevel: PracticalResourceAccess;
  sortOrder: number;
  file?: File | null;
  externalUrl?: string;
}

function sanitizeFileName(fileName: string) {
  const extension = fileName.includes('.') ? `.${fileName.split('.').pop()}` : '';
  const base = fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 60);
  return `${base || 'resource'}${extension.toLowerCase()}`;
}

export async function createPracticalResource(input: PracticalResourceInput) {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) throw new Error('관리자 로그인이 필요합니다.');

  let filePath: string | null = null;
  let fileName: string | null = null;
  let fileSize: number | null = null;
  let mimeType: string | null = null;

  if (input.file) {
    fileName = input.file.name;
    fileSize = input.file.size;
    mimeType = input.file.type || 'application/octet-stream';
    filePath = `${input.accessLevel}/${Date.now()}-${sanitizeFileName(input.file.name)}`;

    const { error: uploadError } = await supabase.storage
      .from(PRACTICAL_RESOURCE_BUCKET)
      .upload(filePath, input.file, {
        cacheControl: '3600',
        upsert: false,
        contentType: mimeType
      });
    if (uploadError) throw uploadError;
  }

  const { data, error } = await supabase
    .from('practical_resources')
    .insert({
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category,
      access_level: input.accessLevel,
      file_path: filePath,
      external_url: input.accessLevel === 'free' ? input.externalUrl?.trim() || null : null,
      file_name: fileName,
      file_size: fileSize,
      mime_type: mimeType,
      is_published: true,
      sort_order: input.sortOrder,
      created_by: user.id
    })
    .select('*')
    .single();

  if (error) {
    if (filePath) {
      await supabase.storage.from(PRACTICAL_RESOURCE_BUCKET).remove([filePath]);
    }
    throw error;
  }
  return data as PracticalResource;
}

export async function setPracticalResourcePublished(id: string, isPublished: boolean) {
  const { error } = await supabase
    .from('practical_resources')
    .update({ is_published: isPublished, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function deletePracticalResource(resource: PracticalResource) {
  if (resource.file_path) {
    const { error: storageError } = await supabase.storage
      .from(PRACTICAL_RESOURCE_BUCKET)
      .remove([resource.file_path]);
    if (storageError) throw storageError;
  }

  const { error } = await supabase.from('practical_resources').delete().eq('id', resource.id);
  if (error) throw error;
}

export function formatResourceSize(size: number | null) {
  if (!size) return '';
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))}KB`;
  return `${(size / 1024 / 1024).toFixed(1)}MB`;
}
