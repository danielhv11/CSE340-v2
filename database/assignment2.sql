--1 Inserting a new record to the account table 

INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--2 Modifying the Tony Stark record to change the account_type to "Admin" 

UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--3 Deleting the Tony Stark record from the database

DELETE FROM public.account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';


--4 Modifying the "GM Hummer" record to read "a huge interior"

UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';


--5 Using an inner join to select specific fields from multiple tables

SELECT inv.inv_make, inv.inv_model, cls.classification_name
FROM public.inventory AS inv
INNER JOIN public.classification AS cls ON inv.classification_id = cls.classification_id
WHERE cls.classification_name = 'Sport';


--6 Updating all records in the inventory table to add "/vehicles" to the middle of the file path

UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');








