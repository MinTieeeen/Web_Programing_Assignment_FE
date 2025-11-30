# Entity Relationship Diagram (Mermaid)

```mermaid
erDiagram
    ADMIN ||--o{ CUSTOMER : "Manages"
    ADMIN ||--o{ GAME : "Approves"
    ADMIN ||--o{ REVIEW : "Manages"
    ADMIN ||--o{ CART : "Monitors"
    
    CUSTOMER ||--o{ REVIEW : "Creates"
    CUSTOMER ||--o{ LIBRARY : "Owns"
    CUSTOMER ||--o{ WISHLIST : "Owns"
    CUSTOMER ||--o{ CART : "Owns"
    
    GAME ||--o{ REVIEW : "Receives"
    GAME }|--|| PUBLISHER : "Publish"
    GAME }o--|| CATEGORY : "in"
    
    LIBRARY }|--o{ GAME : "Contain"
    WISHLIST }|--o{ GAME : "Contain"
    CART }|--o{ GAME : "Contain"
    
    ADMIN {
        int AdminId PK "Primary Key"
        string Username UK "Unique"
        string Password
        date Start_date
    }
    
    CUSTOMER {
        int UserId PK "Primary Key"
        string Username UK "Unique"
        string Password
        string FirstName "Fname"
        string LastName "Lname"
        string Name
        date DateOfBirth "Dob"
        string Email
        string Avatar
        decimal Balance
    }
    
    GAME {
        int GameId PK "Primary Key"
        string Name
        string Description
        string Version
        decimal Cost
        int DownloadNum "Derived attribute"
    }
    
    PUBLISHER {
        int PublisherId PK "Primary Key"
        string Name
        string Location
        string TaxCode
        string Description
    }
    
    CATEGORY {
        int CategoryId PK "Primary Key"
        string Name
        string Description
    }
    
    LIBRARY {
        int LibraryId PK "Primary Key"
        int CustomerId FK "Foreign Key"
        string Name "Derived"
        int DownloadNum "Derived attribute"
    }
    
    WISHLIST {
        int WishlistId PK "Primary Key"
        int CustomerId FK "Foreign Key"
        string Name "Derived"
        int GameNumber "Derived attribute"
    }
    
    CART {
        int CartId PK "Primary Key"
        int CustomerId FK "Foreign Key"
        string Status "Derived"
        string PaymentMethod
        decimal Amount "Derived attribute"
    }
    
    REVIEW {
        int ReviewId PK "Primary Key"
        int CustomerId FK "Foreign Key"
        int GameId FK "Foreign Key"
        datetime Time "Derived"
        string Comment
        int Rating
    }
```

## Relationship Details

### Entity Relationships:
1. **ADMIN - CUSTOMER**: One admin can manage many customers (1:N)
2. **ADMIN - GAME**: One admin can approve many games (1:N)
3. **ADMIN - REVIEW**: One admin can manage many reviews (1:N)
4. **ADMIN - CART**: One admin can monitor many carts (1:N)

5. **CUSTOMER - REVIEW**: One customer can create many reviews (1:N)
6. **CUSTOMER - LIBRARY**: One customer owns one library (1:1)
7. **CUSTOMER - WISHLIST**: One customer owns one wishlist (1:1)
8. **CUSTOMER - CART**: One customer owns one cart (1:1)

9. **GAME - REVIEW**: One game can receive many reviews (1:N)
10. **GAME - PUBLISHER**: Many games can be published by one publisher (N:1)
11. **GAME - CATEGORY**: Many games belong to one category (N:1)

12. **LIBRARY - GAME**: Many-to-many relationship through contains
13. **WISHLIST - GAME**: Many-to-many relationship through contains
14. **CART - GAME**: Many-to-many relationship through contains

### Key Attributes:
- **Primary Keys**: Each entity has a unique identifier
- **Foreign Keys**: Relationships are maintained through foreign key references
- **Derived Attributes**: Some attributes are calculated from other data (shown with dashed lines in original)
- **Unique Keys**: Username fields are unique across the system

### Business Rules:
1. Each customer has exactly one library, wishlist, and cart
2. Games must be approved by admin before being available
3. Reviews require both customer and game to exist
4. Publishers and categories are shared across multiple games
5. Cart contains payment information for purchase processing