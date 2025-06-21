Feature: Complete Purchase Journey
  As a customer
  I want to complete a purchase
  So that I can receive my ordered products

  @checkout @critical
  Scenario: Complete guest checkout process
    Given I have products in my cart
    When I proceed to checkout as guest
    And I fill in billing information
    And I select shipping method
    And I select payment method
    And I agree to terms and conditions
    And I confirm the order
    Then I should see order confirmation
    And order details should be correct

  @checkout @registered
  Scenario: Checkout as registered user
    Given I am logged in as registered user
    And I have products in my cart
    When I proceed to checkout
    And I confirm delivery address
    And I select shipping method
    And I select payment method
    And I confirm the order
    Then I should see order confirmation
    And order should appear in my account history
