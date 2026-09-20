import assert from "node:assert/strict";
import { test } from "node:test";
import { hasAdminRole } from "../../src/lib/auth-core";
import { projectKeys } from "../../src/features/admin/projects/query-keys";
import { uploadSchema } from "../../src/features/admin/projects/schemas";

test("admin role checks support Better Auth role lists", () => {
  assert.equal(hasAdminRole("admin"), true);
  assert.equal(hasAdminRole("user,admin"), true);
  assert.equal(hasAdminRole(["user", "admin"]), true);
  assert.equal(hasAdminRole("user"), false);
  assert.equal(hasAdminRole(null), false);
});

test("admin project query keys are scoped and stable", () => {
  assert.deepEqual(projectKeys.list("drafts"), [
    "admin",
    "projects",
    "list",
    "drafts",
  ]);
  assert.deepEqual(projectKeys.detail("project-id"), [
    "admin",
    "projects",
    "detail",
    "project-id",
  ]);
});

test("project uploads allow supported images up to five megabytes", () => {
  assert.equal(
    uploadSchema.safeParse({ type: "image/webp", size: 5 * 1024 * 1024 })
      .success,
    true,
  );
  assert.equal(
    uploadSchema.safeParse({ type: "image/svg+xml", size: 1_024 }).success,
    false,
  );
  assert.equal(
    uploadSchema.safeParse({
      type: "image/png",
      size: 5 * 1024 * 1024 + 1,
    }).success,
    false,
  );
});
