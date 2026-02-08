import { vi, describe, beforeEach, expect, it } from "vitest";
import { UserRepository } from "../repository/user.repository.js";
import { UserStatus } from "../enums/user.status.enum.js";
import { getSupabaseAdminClient, getSupabaseUserClient } from "../supabase/client.js";

// mock the module that exports these functions
vi.mock("../supabase/client.js", () => {
  return {
    getSupabaseUserClient: vi.fn(),
    getSupabaseAdminClient: vi.fn()
  }
})

function makeQueryBuilder(result: { data?: any; error?: any }) {
  const queryBuilder: any = {};

 queryBuilder.select = vi.fn(() => queryBuilder);
 queryBuilder.neq = vi.fn(() => queryBuilder);
 queryBuilder.ilike = vi.fn(() => queryBuilder);
 queryBuilder.order = vi.fn(() => queryBuilder);
 queryBuilder.limit = vi.fn(() => result);

 queryBuilder.update = vi.fn(() => queryBuilder);
 queryBuilder.eq = vi.fn(() => queryBuilder);

 queryBuilder.single = vi.fn(async () => result);
 queryBuilder.maybeSingle = vi.fn(async () => result);

 queryBuilder.then = undefined;

  return queryBuilder;
}

function makeUserClient(options: {
  authUserId?: string;
  authError?: any;
  fromResult?: { data?: any; error?: any };
}) {
  const queryBuilder = makeQueryBuilder(options.fromResult ?? { data: null, error: null });

  return {
    auth: {
      getUser: vi.fn(async () => {
        if (options.authError) return { data: null, error: options.authError };
        return { data: { user: options.authUserId ? { id: options.authUserId } : null }, error: null };
      }),
    },
    from: vi.fn(() => queryBuilder),
    __queryBuilder: queryBuilder,
  };
}


function makeAdminClient(fromResult: { data?: any; error?: any }) {
  const qb = makeQueryBuilder(fromResult);
  return {
    from: vi.fn(() => qb),
    __qb: qb,
  };
}

describe("UserRepository.searchUsersByNameAsUser", () => {
  const repo = new UserRepository();

  beforeEach(() => vi.clearAllMocks());

  it("returns [] when name is blank after trim", async () => {
    const accessToken = "t";
    // even if client exists, it should return early
    (getSupabaseUserClient as any).mockReturnValue(makeUserClient({ authUserId: "u1" }));

    const res = await repo.searchUsersByNameAsUser(accessToken, "   ");
    expect(res).toEqual([]);
    // should not query DB
    expect(getSupabaseUserClient).not.toHaveBeenCalled();
  });

  it("builds correct query and returns results", async () => {
    const accessToken = "t";
    const rows = [{ full_name: "Vinh", email: "vinh@tcu.edu" }];

    const client = makeUserClient({
      authUserId: "u1",
      fromResult: { data: rows, error: null },
    });

    (getSupabaseUserClient as any).mockReturnValue(client);

    const res = await repo.searchUsersByNameAsUser(accessToken, "vin", 5);

    expect(res).toEqual(rows);

    expect(client.from).toHaveBeenCalledWith("users");
    expect(client.__queryBuilder.select).toHaveBeenCalled();
    expect(client.__queryBuilder.neq).toHaveBeenCalledWith("status", UserStatus.DELETED);
    expect(client.__queryBuilder.ilike).toHaveBeenCalledWith("full_name", "%vin%");
    expect(client.__queryBuilder.order).toHaveBeenCalledWith("full_name", { ascending: true });
    expect(client.__queryBuilder.limit).toHaveBeenCalledWith(5);
  });

  it("throws when supabase returns error", async () => {
    const client = makeUserClient({
      authUserId: "u1",
      fromResult: { data: null, error: { message: "db down" } },
    });
    (getSupabaseUserClient as any).mockReturnValue(client);

    await expect(repo.searchUsersByNameAsUser("t", "vin")).rejects.toThrow("db down");
  });
});

describe("UserRepository.searchUsersByEmailAsUser", () => {
  const repo = new UserRepository();
  beforeEach(() => vi.clearAllMocks());

  it("returns [] when email is blank", async () => {
    (getSupabaseUserClient as any).mockReturnValue(makeUserClient({ authUserId: "u1" }));
    const res = await repo.searchUsersByEmailAsUser("t", "   ");
    expect(res).toEqual([]);
  });

  it("queries by email ilike and returns results", async () => {
    const rows = [{ full_name: "Vinh", email: "vinh@tcu.edu" }];
    const client = makeUserClient({ authUserId: "u1", fromResult: { data: rows, error: null } });
    (getSupabaseUserClient as any).mockReturnValue(client);

    const res = await repo.searchUsersByEmailAsUser("t", "vinh@tcu.edu", 10);

    expect(res).toEqual(rows);
    expect(client.__queryBuilder.ilike).toHaveBeenCalledWith("email", "vinh@tcu.edu");
    expect(client.__queryBuilder.order).toHaveBeenCalledWith("email", { ascending: true });
  });
});

describe("UserRepository.selfDeleteAccountAsUser", () => {
  const repo = new UserRepository();
  beforeEach(() => vi.clearAllMocks());

  it("soft deletes own row", async () => {
    const client = makeUserClient({
      authUserId: "self-123",
      fromResult: { data: null, error: null },
    });
    (getSupabaseUserClient as any).mockReturnValue(client);

    const res = await repo.selfDeleteAccountAsUser("t");

    expect(res).toEqual({ deleted: true });
    expect(client.auth.getUser).toHaveBeenCalled();

    expect(client.__queryBuilder.update).toHaveBeenCalledWith({ status: UserStatus.DELETED });
    expect(client.__queryBuilder.eq).toHaveBeenCalledWith("id", "self-123");
  });

  it("throws if not authenticated", async () => {
    const client = makeUserClient({ authError: { message: "Invalid token" } });
    (getSupabaseUserClient as any).mockReturnValue(client);

    await expect(repo.selfDeleteAccountAsUser("t")).rejects.toThrow("Invalid token");
  });

  it("throws if update fails", async () => {
    const client = makeUserClient({
      authUserId: "self-123",
      fromResult: { error: { message: "update failed" } },
    });
    (getSupabaseUserClient as any).mockReturnValue(client);

    await expect(repo.selfDeleteAccountAsUser("t")).rejects.toThrow("update failed");
  });
});

describe("UserRepository.getSelfByTokenAsUser", () => {
  const repo = new UserRepository();
  beforeEach(() => vi.clearAllMocks());

  it("fetches user by id from token", async () => {
    const userRow = { id: "self-1", full_name: "Vinh" };

    const client = makeUserClient({
      authUserId: "self-1",
      fromResult: { data: userRow, error: null },
    });
    (getSupabaseUserClient as any).mockReturnValue(client);

    const res = await repo.getSelfByTokenAsUser("t");

    expect(res).toEqual(userRow);
    expect(client.__queryBuilder.select).toHaveBeenCalledWith("*");
    expect(client.__queryBuilder.eq).toHaveBeenCalledWith("id", "self-1");
    expect(client.__queryBuilder.single).toHaveBeenCalled();
  });
});

describe("UserRepository.updateSelfByTokenAsUser", () => {
  const repo = new UserRepository();
  beforeEach(() => vi.clearAllMocks());

  it("maps patch to update payload and updates self", async () => {
    const updated = { id: "self-1", full_name: null, email: "a@b.com" };

    const client = makeUserClient({
      authUserId: "self-1",
      fromResult: { data: updated, error: null },
    });
    (getSupabaseUserClient as any).mockReturnValue(client);

    const patch: any = { full_name: undefined, email: "a@b.com" };

    const res = await repo.updateSelfByTokenAsUser("t", patch);

    expect(res).toEqual(updated);

    // full_name present with undefined -> null
    expect(client.__queryBuilder.update).toHaveBeenCalledWith({
      full_name: null,
      email: "a@b.com",
    });
    expect(client.__queryBuilder.eq).toHaveBeenCalledWith("id", "self-1");
    expect(client.__queryBuilder.single).toHaveBeenCalled();
  });

  it("does not include fields not present in patch", async () => {
    const updated = { id: "self-1" };
    const client = makeUserClient({
      authUserId: "self-1",
      fromResult: { data: updated, error: null },
    });
    (getSupabaseUserClient as any).mockReturnValue(client);

    await repo.updateSelfByTokenAsUser("t", { email: "x@y.com" } as any);

    expect(client.__queryBuilder.update).toHaveBeenCalledWith({ email: "x@y.com" });
  });
});

describe("UserRepository.updateSelfByTokenAsUser", () => {
  const repo = new UserRepository();
  beforeEach(() => vi.clearAllMocks());

  it("maps patch to update payload and updates self", async () => {
    const updated = { id: "self-1", full_name: null, email: "a@b.com" };

    const client = makeUserClient({
      authUserId: "self-1",
      fromResult: { data: updated, error: null },
    });
    (getSupabaseUserClient as any).mockReturnValue(client);

    const patch: any = { full_name: undefined, email: "a@b.com" };

    const res = await repo.updateSelfByTokenAsUser("t", patch);

    expect(res).toEqual(updated);

    // full_name present with undefined -> null
    expect(client.__queryBuilder.update).toHaveBeenCalledWith({
      full_name: null,
      email: "a@b.com",
    });
    expect(client.__queryBuilder.eq).toHaveBeenCalledWith("id", "self-1");
    expect(client.__queryBuilder.single).toHaveBeenCalled();
  });

  it("does not include fields not present in patch", async () => {
    const updated = { id: "self-1" };
    const client = makeUserClient({
      authUserId: "self-1",
      fromResult: { data: updated, error: null },
    });
    (getSupabaseUserClient as any).mockReturnValue(client);

    await repo.updateSelfByTokenAsUser("t", { email: "x@y.com" } as any);

    expect(client.__queryBuilder.update).toHaveBeenCalledWith({ email: "x@y.com" });
  });
});

describe("UserRepository.softDeleteUserAsAdmin", () => {
  const repo = new UserRepository();
  beforeEach(() => vi.clearAllMocks());

  it("soft deletes user as admin", async () => {
    const admin = makeAdminClient({ data: null, error: null });
    (getSupabaseAdminClient as any).mockReturnValue(admin);

    const res = await repo.softDeleteUserAsAdmin("u-99");

    expect(res).toEqual({ deleted: true });
    expect(admin.from).toHaveBeenCalledWith("users");
    expect(admin.__qb.update).toHaveBeenCalledWith({ status: UserStatus.DELETED });
    expect(admin.__qb.eq).toHaveBeenCalledWith("id", "u-99");
  });

  it("throws on admin delete error", async () => {
    const admin = makeAdminClient({ error: { message: "no permission" } });
    (getSupabaseAdminClient as any).mockReturnValue(admin);

    await expect(repo.softDeleteUserAsAdmin("u-99")).rejects.toThrow("no permission");
  });
});

