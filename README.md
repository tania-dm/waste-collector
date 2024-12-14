# Waste collector



## Description

Before a customer can request their waste to be collected, we need to verify which waste streams are available for pickup at a given date. The task is to complete two services, one of them to retrieve availability of service providers and another to register the collection.

## Technologies Used

This project is built using the following technologies:

- Node.js
- npm
- TypeScript

## Data Model Representation

### Service Provider

A Service Provider can be described as:
A business that can collect a specific set of waste streams.

| id |      name      |                 address                 | covered streams |
|:--:|:--------------:|:---------------------------------------:|:---------------:|
| 1  |    Rewaste     |   Stationplein, 1, 1012 AB Amsterdam    |     [1, 2]      |
| 2  | Bluecollection | Prins Hendrikkade, 1, 1012 JD Amsterdam |       [3]       |

#### Service Provider Coverage

Service provider coverage can be described as:
The streams in which a service provider has covered in a postal code range, for a given date availability.

| id | stream_id | postal_code_start | postal_code_end |  availability   |
|:--:|:---------:|:-----------------:|:---------------:|:---------------:|
| 1  |   paper   |       1010        |      1020       |    [1, 2, 3]    |
| 2  |   metal   |       1010        |      1020       |   [1, 4, 5 ]    |
| 3  |   metal   |       1000        |      9999       | [1, 2, 3, 4, 5] |

#### Coverage Availability

Coverage availability can be described as:
A simple Date reference of an availability calendar.

| id |    date    |
|:--:|:----------:|
| 1  | 2023-10-01 |
| 2  | 2023-10-02 |
| 3  | 2023-10-03 |
| 4  | 2023-10-04 |
| 5  | 2023-10-05 |

---

### Customer

A Customer can be described as:
A person or business entity that has waste to be collected at a given address.

| id |     name      |                  address                  | streams |
|:--:|:-------------:|:-----------------------------------------:|:-------:|
| 1  |    Hema       |    Danzigerkade 5B, 1013 AP Amsterdam     |   [1]   |
| 1  | Mega City One | Prins Hendrikkade, 100, 1012 JD Amsterdam |  [2,3]  |

#### Customer Streams

A Customer Stream can be described as:
A registered stream pickup for a customer to be performed by a Service Provider at a given date and how many containers.

| id | stream_id | service_provider_id | pickup_date | quantity |
|:--:|:---------:|:-------------------:|-------------|----------|
| 1  |   paper   |          1          | 2023-10-01  | 1        |
| 2  |   metal   |          2          | 2023-10-01  | 1        |
| 3  |   metal   |          2          | 2023-10-02  | 1        |


### Output

#### Expectation

When registering a stream pick up, at least the following requirements must be met:

- The Service Provider exists
- The Stream exists
- Ensure availability

When searching for service providers, the expected results is:

| postal_code |    date    | result                                          |
|:-----------:|:----------:|-------------------------------------------------|
|    1010     | 2023-10-01 | [Rewaste (paper, metal), Bluecollection(metal)] |
|    1010     | 2023-10-04 | [Rewaste(metal) , Bluecollection(metal)]        |
|    2000     | 2023-10-05 | [Bluecollection(metal)]                         |
|    2000     | 2023-10-06 | []                                              |
