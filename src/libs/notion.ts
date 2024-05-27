import { NotionAPI } from 'notion-client';
import { Block } from 'notion-types';
//import cache from 'memory-cache'
const notion = new NotionAPI({
  authToken: process.env.NOTION_AUTH_TOKEN,
});

export async function getRecordMap(id: string) {
  //console.log('[Fetching Data]', id)
  // Check if the record map is already in the cache
//const cachedRecordMap = cache.get(id);
  // If the record map is in the cache, return it
//if (cachedRecordMap) {    return cachedRecordMap;  }

  //return notion.getPage(id);
  const recordMap = await notion.getPage(id);

        // Store the record map in the cache
  //cache.put(id, recordMap);

        // Return the record map
  return recordMap;
}

export function mapImageUrl(url: string, block: Block): string | null {
  if (!url) {
    return null;
  }

  if (url.startsWith('data:')) {
    return url;
  }

  // more recent versions of notion don't proxy unsplash images
  if (url.startsWith('https://images.unsplash.com')) {
    return url;
  }

  try {
    const u = new URL(url);

    if (
      u.pathname.startsWith('/secure.notion-static.com') &&
      u.hostname.endsWith('.amazonaws.com')
    ) {
      if (
        u.searchParams.has('X-Amz-Credential') &&
        u.searchParams.has('X-Amz-Signature') &&
        u.searchParams.has('X-Amz-Algorithm')
      ) {
        // if the URL is already signed, then use it as-is
        return url;
      }
    }
  } catch {
    // ignore invalid urls
  }

  if (url.startsWith('/images')) {
    url = `https://www.notion.so${url}`;
  }

  url = `https://www.notion.so${
    url.startsWith('/image') ? url : `/image/${encodeURIComponent(url)}`
  }`;

  const notionImageUrlV2 = new URL(url);
  let table = block.parent_table === 'space' ? 'block' : block.parent_table;
  if (table === 'collection' || table === 'team') {
    table = 'block';
  }
  notionImageUrlV2.searchParams.set('table', table);
  notionImageUrlV2.searchParams.set('id', block.id);
  notionImageUrlV2.searchParams.set('cache', 'v2');

  url = notionImageUrlV2.toString();

  return url;
}
