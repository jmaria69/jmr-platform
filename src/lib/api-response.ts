/**
 * Standardized API response helpers
 *
 * Ensures every API route returns consistent shape:
 * { data?, error?, meta? }
 */

import { NextResponse } from "next/server";

interface ApiSuccessResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function apiSuccess<T>(
  data: T,
  meta?: Record<string, unknown>,
  status = 200
) {
  const body: ApiSuccessResponse<T> = { data };
  if (meta) body.meta = meta;
  return NextResponse.json(body, { status });
}

export function apiCreated<T>(data: T) {
  return apiSuccess(data, undefined, 201);
}

export function apiError(
  code: string,
  message: string,
  status: number,
  details?: unknown
) {
  const body: ApiErrorResponse = {
    error: { code, message, ...(details ? { details } : {}) },
  };
  return NextResponse.json(body, { status });
}

export function apiBadRequest(message: string, details?: unknown) {
  return apiError("BAD_REQUEST", message, 400, details);
}

export function apiNotFound(resource: string) {
  return apiError("NOT_FOUND", `${resource} no encontrado`, 404);
}

export function apiUnauthorized(message = "No autorizado") {
  return apiError("UNAUTHORIZED", message, 401);
}

export function apiServerError(message = "Error interno del servidor") {
  return apiError("INTERNAL_ERROR", message, 500);
}
