import "dotenv/config";
import assert from "node:assert/strict";
import bcrypt from "bcrypt";
import pool from "../config/database.js";
import app from "../app.js";

const unique = Date.now().toString();
const baseUrl = await new Promise((resolve) => {
  const server = app.listen(0, "127.0.0.1", () => {
    const address = server.address();
    resolve({ server, url: `http://127.0.0.1:${address.port}/api` });
  });
});

let userId;
let adminId;
let categoryId;
let destinationId;

async function request(path, { method = "GET", token, body } = {}) {
  const response = await fetch(`${baseUrl.url}${path}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  const data = await response.json();
  return { status: response.status, data };
}

function expectStatus(result, expected, label) {
  assert.equal(
    result.status,
    expected,
    `${label}: expected HTTP ${expected}, received ${result.status}. Body: ${JSON.stringify(result.data)}`
  );
}

try {
  assert.ok(process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32, "JWT_SECRET must contain at least 32 characters.");

  const health = await request("/health");
  expectStatus(health, 200, "Database health check");

  const categoriesResponse = await request("/categories");
  expectStatus(categoriesResponse, 200, "List categories");
  assert.ok(categoriesResponse.data.data.length >= 7, "Seeded categories should be available.");

  const register = await request("/auth/register", {
    method: "POST",
    body: {
      name: "TRIPIN CI User",
      email: `tripin-ci-user-${unique}@example.test`,
      password: "TripinTestUser!2026"
    }
  });
  expectStatus(register, 201, "Register user");
  const userToken = register.data.data.token;
  userId = register.data.data.user.id;
  assert.ok(userToken, "Registration should return a JWT.");

  const login = await request("/auth/login", {
    method: "POST",
    body: { email: `tripin-ci-user-${unique}@example.test`, password: "TripinTestUser!2026" }
  });
  expectStatus(login, 200, "Login user");

  const profile = await request("/auth/profile", { token: userToken });
  expectStatus(profile, 200, "Read user profile");
  assert.equal(profile.data.data.role, "user");

  const deniedAdmin = await request("/admin/stats", { token: userToken });
  expectStatus(deniedAdmin, 403, "Block user from admin endpoint");

  const adminEmail = `tripin-ci-admin-${unique}@example.test`;
  const adminHash = await bcrypt.hash("TripinTestAdmin!2026", 10);
  const [adminInsert] = await pool.execute(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')",
    ["TRIPIN CI Admin", adminEmail, adminHash]
  );
  adminId = adminInsert.insertId;

  const adminLogin = await request("/auth/login", {
    method: "POST",
    body: { email: adminEmail, password: "TripinTestAdmin!2026" }
  });
  expectStatus(adminLogin, 200, "Login admin");
  const adminToken = adminLogin.data.data.token;
  assert.equal(adminLogin.data.data.user.role, "admin");

  const adminStats = await request("/admin/stats", { token: adminToken });
  expectStatus(adminStats, 200, "Read admin statistics");

  const createdCategory = await request("/categories", {
    method: "POST",
    token: adminToken,
    body: { category_name: `CI Category ${unique}`, description: "Temporary integration-test category" }
  });
  expectStatus(createdCategory, 201, "Create category");
  categoryId = createdCategory.data.data.id;

  const destinationPayload = {
    category_id: categoryId,
    name: `CI Destination ${unique}`,
    description: "Temporary destination created by automated integration tests.",
    address: "Automated test address",
    district: "Test District",
    latitude: null,
    longitude: null,
    price_min: 5000,
    price_max: 15000,
    opening_hours: "Test schedule",
    image: "",
    is_published: true
  };

  const forbiddenCreate = await request("/destinations", {
    method: "POST",
    token: userToken,
    body: destinationPayload
  });
  expectStatus(forbiddenCreate, 403, "Block user from destination management");

  const createdDestination = await request("/destinations", {
    method: "POST",
    token: adminToken,
    body: destinationPayload
  });
  expectStatus(createdDestination, 201, "Create destination");
  destinationId = createdDestination.data.data.id;

  const destinationList = await request(`/destinations?search=${encodeURIComponent(destinationPayload.name)}`);
  expectStatus(destinationList, 200, "Search destinations");
  assert.equal(destinationList.data.pagination.total, 1);

  const categoryDestinations = await request(`/categories/${categoryId}/destinations`);
  expectStatus(categoryDestinations, 200, "List category destinations");
  assert.equal(categoryDestinations.data.data.length, 1);

  const destinationDetail = await request(`/destinations/${destinationId}`);
  expectStatus(destinationDetail, 200, "Read destination detail");

  const createdReview = await request("/reviews", {
    method: "POST",
    token: userToken,
    body: { destination_id: destinationId, rating: 5, comment: "A useful integration test review." }
  });
  expectStatus(createdReview, 201, "Create review");
  const reviewId = createdReview.data.data.id;

  const duplicateReview = await request("/reviews", {
    method: "POST",
    token: userToken,
    body: { destination_id: destinationId, rating: 4, comment: "Duplicate review should be rejected." }
  });
  expectStatus(duplicateReview, 409, "Reject duplicate review");

  const reviewList = await request(`/reviews/${destinationId}`);
  expectStatus(reviewList, 200, "Read destination reviews");
  assert.equal(reviewList.data.data.length, 1);

  const myReviews = await request("/reviews/mine", { token: userToken });
  expectStatus(myReviews, 200, "Read user review history");
  assert.equal(myReviews.data.data.length, 1);

  const updatedReview = await request(`/reviews/${reviewId}`, {
    method: "PUT",
    token: userToken,
    body: { rating: 4, comment: "Updated integration test review." }
  });
  expectStatus(updatedReview, 200, "Update review");

  const adminReviewList = await request("/admin/reviews", { token: adminToken });
  expectStatus(adminReviewList, 200, "Admin review moderation list");
  assert.ok(adminReviewList.data.data.some((review) => Number(review.id) === Number(reviewId)));

  const adminDeletedReview = await request(`/admin/reviews/${reviewId}`, {
    method: "DELETE",
    token: adminToken
  });
  expectStatus(adminDeletedReview, 200, "Admin delete review");

  const secondReview = await request("/reviews", {
    method: "POST",
    token: userToken,
    body: { destination_id: destinationId, rating: 5, comment: "Second review for owner-delete test." }
  });
  expectStatus(secondReview, 201, "Create second review");
  const ownerDeletedReview = await request(`/reviews/${secondReview.data.data.id}`, {
    method: "DELETE",
    token: userToken
  });
  expectStatus(ownerDeletedReview, 200, "Owner delete review");

  const addedFavorite = await request("/favorites", {
    method: "POST",
    token: userToken,
    body: { destination_id: destinationId }
  });
  expectStatus(addedFavorite, 201, "Add favorite");

  const favorites = await request("/favorites", { token: userToken });
  expectStatus(favorites, 200, "List favorites");
  assert.equal(favorites.data.data.length, 1);

  const removedFavorite = await request(`/favorites/${destinationId}`, {
    method: "DELETE",
    token: userToken
  });
  expectStatus(removedFavorite, 200, "Remove favorite");

  const updatedProfile = await request("/auth/profile", {
    method: "PUT",
    token: userToken,
    body: { name: "TRIPIN CI Updated User" }
  });
  expectStatus(updatedProfile, 200, "Update user profile");
  assert.equal(updatedProfile.data.data.name, "TRIPIN CI Updated User");

  const updatedDestination = await request(`/destinations/${destinationId}`, {
    method: "PUT",
    token: adminToken,
    body: { ...destinationPayload, name: `${destinationPayload.name} Updated` }
  });
  expectStatus(updatedDestination, 200, "Update destination");

  const deletedDestination = await request(`/destinations/${destinationId}`, {
    method: "DELETE",
    token: adminToken
  });
  expectStatus(deletedDestination, 200, "Delete destination");

  const updatedCategory = await request(`/categories/${categoryId}`, {
    method: "PUT",
    token: adminToken,
    body: { category_name: `CI Category Updated ${unique}`, description: "Updated integration-test category" }
  });
  expectStatus(updatedCategory, 200, "Update category");

  const deletedCategory = await request(`/categories/${categoryId}`, {
    method: "DELETE",
    token: adminToken
  });
  expectStatus(deletedCategory, 200, "Delete category");

  console.log("TRIPIN API integration tests passed: auth, RBAC, categories, destinations, reviews, favorites, and admin.");
} finally {
  try {
    if (destinationId) await pool.execute("DELETE FROM destinations WHERE id = ?", [destinationId]);
    if (categoryId) await pool.execute("DELETE FROM categories WHERE id = ?", [categoryId]);
    if (userId) await pool.execute("DELETE FROM users WHERE id = ?", [userId]);
    if (adminId) await pool.execute("DELETE FROM users WHERE id = ?", [adminId]);
  } finally {
    await new Promise((resolve) => baseUrl.server.close(resolve));
    await pool.end();
  }
}
