"use client";

import { useMutation } from "@tanstack/react-query";
import { aiApi } from "@/lib/api-client";
import type { AiMatchResponse, AiDescriptionResult, AiEmailResult } from "@/types";

export function useMatchLeadProperties() {
  return useMutation<AiMatchResponse, Error, { leadId: string; propertyIds?: string[] }>({
    mutationFn: (data) => aiApi.matchLeadProperties(data) as Promise<AiMatchResponse>,
  });
}

export function useGeneratePropertyDescription() {
  return useMutation<AiDescriptionResult, Error, { propertyId: string; tone: string }>({
    mutationFn: (data) => aiApi.generatePropertyDescription(data) as Promise<AiDescriptionResult>,
  });
}

export function useGenerateOutreachEmail() {
  return useMutation<AiEmailResult, Error, { leadId: string; propertyId: string; tone: string }>({
    mutationFn: (data) => aiApi.generateOutreachEmail(data) as Promise<AiEmailResult>,
  });
}
