Merge both admin and users table into a single table. And remove Admin table
model User {
role: SuperAdmin | User
}
change user table id to auto increment primary key
remove admin register api and replace it wit a custom seed script that will seed a admin in users table if already not exist.
confirm admin login should not allow login to role user

Add server url in .env
Create api client method
move login page /login route in admin side
call login api with createApiClient and save token in localstorage and move user to /dashboard
Fix the protected routes ability. Which means if user is logged in (token exist in localstroage) , User should not be able to access /login page. And if user is not logged in, user should not be able to access any dashboard route other than login
Fix get profile api and make it working properly by using getApiClient

Add user foreign key in Category table
Add user foreign key in Product table
Add user foreign key in Orders table

remove image column and always use images for both multiple and single product image
In every table add createdAt, updatedAt, deletedAt (Add support for soft delete for all tables). Also learn soft delete and hard delete concept in software engineering
Fix product foreign key data type in product images table
Currently all orders are showign for all users even if they do not belong to that user. This is a data privacy case
This data should not be saved in user orders table . 2
