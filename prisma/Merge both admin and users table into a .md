Merge both admin and users table into a single table. And remove Admin table
model User {
role: SuperAdmin | User
}

Add user foreign key in Category table
Add user foreign key in Product table
remove image column and always use images for both multiple and single product image
fix category and userId foreign key in proudcts table. Make them required and Always use datatype Int for foregin key
In every table add createdAt, updatedAt, deletedAt (Add support for soft delete for all tables). Also learn soft delete and hard delete concept in software engineering
Fix product foreign key data type in product images table
Currently all orders are showign for all users even if they do not belong to that user. This is a data privacy case
This data should not be saved in user orders table . 2
