import { permanentRedirect } from "next/navigation";

type Props = {
  params: Promise<{ tool?: string[] }>;
};

export default async function StudioRedirect({ params }: Props) {
  const { tool } = await params;
  const suffix = tool?.length ? `/${tool.join("/")}` : "";
  permanentRedirect(`/admin${suffix}`);
}
