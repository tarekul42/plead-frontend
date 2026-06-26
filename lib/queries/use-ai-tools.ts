"use client";

import { useMutation } from "@tanstack/react-query";
import { aiApi } from "@/lib/api-client";
import type { AiMatchResult, AiDescriptionResult, AiEmailResult } from "@/types/api";

export function useMatchLeadProperties() {
  return useMutation<AiMatchResult[], Error, { leadId: string; propertyIds?: string[] }>({
    mutationFn: (data) => aiApi.matchLeadProperties(data).then((r) => r.data),
  });
}

export function useGeneratePropertyDescription() {
  return useMutation<AiDescriptionResult, Error, { propertyId: string; tone: string }>({
    mutationFn: (data) => aiApi.generatePropertyDescription(data).then((r) => r.data),
  });
}

export function useGenerateOutreachEmail() {
  return useMutation<AiEmailResult, Error, { leadId: string; propertyId: string; tone: string }>({
    mutationFn: (data) => aiApi.generateOutreachEmail(data).then((r) => r.data),
  });
}
