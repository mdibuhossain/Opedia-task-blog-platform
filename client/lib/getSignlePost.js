export default async function getSinglePost(id) {
  const result = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/post/${id}`, {
    method: "GET",
    next: {
      revalidate: 2,
    },
  });
  return result.json();
}
