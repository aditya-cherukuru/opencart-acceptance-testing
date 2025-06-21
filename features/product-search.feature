Feature: Product Search and Discovery
  As a customer
  I want to find products easily
  So that I can purchase what I need

  Background:
    Given I am on the OpenCart demo homepage

  @search @smoke
  Scenario: Basic product search
    When I search for "laptop"
    Then I should see relevant search results
    And results should contain "laptop" in product names

  @search @sorting
  Scenario: Search results sorting
    When I search for "phone"
    And I sort by "price-low-to-high"
    Then results should be sorted by price ascending

  @search @filtering
  Scenario: Advanced search with filters
    When I search for "camera"
    And I apply price filter "100-500"
    And I sort by "rating-high-to-low"
    Then I should see filtered results within price range
    And results should be sorted by rating

  @search @negative
  Scenario: Search for non-existent product
    When I search for "nonexistentproduct12345"
    Then I should see no results message
