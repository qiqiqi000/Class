drop procedure if exists test11;
DELIMITER $$
create procedure test11($year int, $month int)
begin
with tmp as (
	select orderid, JSON_ARRAYAGG(JSON_OBJECT('productid',productid,'quantity',quantity,'unitprice',unitprice,'discount',discount)) AS items
	from orderitems
	group by orderid)
	select a.orderid, b.orderdate, b.customerid, a.items from tmp as a
	join orders b using(orderid) where year(orderdate)=$year and month(orderdate)=$month;
end $$
DELIMITER ;
call test11(2018,12);

drop procedure if exists test12;
DELIMITER $$
create procedure test12()
begin
	select customerid, companyname from customers;
end $$
DELIMITER ;

