export default function PropertyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Property: {params.slug}</h1>
    </div>
  );
}
