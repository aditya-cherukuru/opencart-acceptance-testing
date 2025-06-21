Feature: Shopping Cart Management
  As a customer
  I want to manage my shopping cart
  So that I can review and modify my purchases

  Background:
    Given I am on the OpenCart demo homepage

  @cart @smoke
  Scenario: Add products to cart
    When I add multiple products to cart
    Then cart should contain added products
    And cart total should be calculated correctly

  @cart
  Scenario: Update product quantity in cart
    Given I have products in my cart
    When I update quantity of first product to 3
    Then cart total should be updated accordingly

  @cart
  Scenario: Remove product from cart
    Given I have products in my cart
    When I remove first product from cart
    Then product should be removed from cart
    And cart total should be recalculated
