Feature: User Registration and Authentication
  As a new customer
  I want to create an account and login
  So that I can make purchases and track orders

  Background:
    Given I am on the OpenCart demo homepage

  @smoke @registration
  Scenario: Successful user registration with valid data
    Given I navigate to the registration page
    When I fill in valid registration details
    And I agree to the privacy policy
    And I click the continue button
    Then I should see a success confirmation
    And I should receive a welcome email

  @registration @validation
  Scenario Outline: Registration validation with invalid data
    Given I navigate to the registration page
    When I fill in registration details with "<field>" as "<value>"
    And I agree to the privacy policy
    And I click the continue button
    Then I should see validation error for "<field>"

    Examples:
      | field      | value              |
      | firstName  |                    |
      | lastName   |                    |
      | email      | invalid-email      |
      | email      |                    |
      | telephone  |                    |
      | password   | 123                |

  @login
  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I login with valid credentials
    Then I should be redirected to my account page

  @login @negative
  Scenario: Login attempt with invalid credentials
    Given I am on the login page
    When I login with invalid credentials
    Then I should see login error message
