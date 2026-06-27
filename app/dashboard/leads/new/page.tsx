"use client";

import { useRouter } from "next/navigation";
import { useCreateLead } from "@/lib/queries/use-leads";
import { LeadForm } from "@/components/forms/lead-form";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewLeadPage() {
  const router = useRouter();
  const createLead = useCreateLead();

  return (
    <div>
      <Link
        href="/dashboard/leads"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </Link>
      <PageHeader title="New Lead" description="Add a new lead to your pipeline." />
      <Card>
        <CardContent className="p-6">
          <LeadForm
            onSubmit={async (data) => {
              await createLead.mutateAsync(data);
              router.push("/dashboard/leads");
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
