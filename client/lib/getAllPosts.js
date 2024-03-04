export default async function getAllPosts({ page, limit }) {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER}/posts?page=${page}&limit=${limit}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  return result.json();
}
