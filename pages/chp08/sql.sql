CREATE DEFINER=`root`@`localhost` PROCEDURE `cateTree`()
begin
select CategoryID as id, CategoryName as text,ParentNodeID,level ,ancestor,IsParentFlag
from categorytree 
order by concat(trim(ancestor),id);
end

CREATE DEFINER=`root`@`localhost` PROCEDURE `p1`(
  $productname varchar(50),
  $englishname varchar(60),
  $unitprice decimal(12,2),
  $categoryid varchar(10),
	$unit varchar(10),
	$subcategoryid varchar(10),
	$QuantityPerunit varchar(10),
	$supplierid varchar(10)
)
begin 
  insert into products(productname,englishname,unitprice,categoryid,subcategoryid,QuantityPerunit,supplierid,unit)
    values($productname,$englishname,$unitprice,$categoryid,$subcategoryid,$QuantityPerunit,$supplierid,$unit);
end

CREATE DEFINER=`root`@`localhost` PROCEDURE `p2`(
  $productid varchar(50)
)
begin 
  delete from products 
	where productid=$productid;
end

CREATE DEFINER=`root`@`localhost` PROCEDURE `p3`(
  $productid varchar(50),
  $productname varchar(50),
  $englishname varchar(60),
  $unitprice decimal(12,2),
  $categoryid varchar(10),
	$subcategoryid varchar(10),
	$unit varchar(10),
	$QuantityPerunit varchar(10),
	$supplierid varchar(10)
)
begin 
  set sql_safe_updates=0;
  replace products(productid,productname,englishname,unitprice,categoryid,subcategoryid,QuantityPerunit,supplierid,unit)
    values($productid,$productname,$englishname,$unitprice,$categoryid,$subcategoryid,$QuantityPerunit,$supplierid,$unit);
end