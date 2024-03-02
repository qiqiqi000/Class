use mysales;
drop procedure if exists app01; 
delimiter $$
create procedure app01()
begin
	select *, exampleid as id, if(level>1, concat('   实例',exampleid,' ',title), title) as text,
    if(level>1, concat('   实例',exampleid,' ',title), title) as label,
    if(level=1,"arrowforwardIcon","arrowforwardIcon") as iconCls     
    from examples order by concat(trim(ancestor),id);
end $$
delimiter ;

drop procedure if exists app02; 
delimiter $$
create procedure app02()
begin
	select *, exampleid as id, exampleid as 'key', if(level>1, concat('实例',exampleid,' ',title), title) as text,
    if(level>1, concat('实例',exampleid,' ',title), title) as label
    from examples where title<>'' order by concat(trim(ancestor),id);
end $$
delimiter ;
#call app02();
drop procedure if exists app03; 
delimiter $$
create procedure app03()
begin
	select *, exampleid as id, exampleid as 'key' from examples where title='';
end $$
delimiter ;
#call app03();

drop procedure if exists app04; 
delimiter $$
create procedure app04()
begin
	select *, exampleid as id, exampleid as 'key', if(level>1, concat('实例',exampleid,' ',title), title) as text,
    if(level>1, concat('实例',exampleid,' ',title), title) as label
    from examples where isparentflag=0 order by concat(trim(ancestor),id);
end $$
delimiter ;

drop procedure if exists demo301a; 
delimiter $$
create procedure demo301a(
	$unitprice1 decimal(6,2),
	$unitprice2 decimal(6,2)
)
begin
	select * from products where unitprice between $unitprice1 and $unitprice2 order by unitprice;
end $$
delimiter ;
#call demo301a(10,20);

drop procedure if exists demo302a; 
delimiter $$
create procedure demo302a()
begin
	select *, categoryid as 'value', categoryname as 'label' from categories;
end $$
delimiter ;

drop procedure if exists demo302b; 
delimiter $$
create procedure demo302b(
	$categoryid varchar(10)
)
begin
	select *, productid as 'value', productname as 'label' from products where categoryid=$categoryid;
end $$
delimiter ;

drop procedure if exists demo302c; 
delimiter $$
create procedure demo302c(
	$productid int,
	$date1 date,
	$date2 date
)
begin
	select a.orderid,a.orderdate,a.customerid,c.companyname,b.quantity, b.unitprice,b.amount from orders a 
    join orderitems b using(orderid) 
    join customers c using(customerid) 
    where productid=$productid and orderdate between $date1 and $date2;
end $$
delimiter ;

drop procedure if exists demo303a;
delimiter $$
create procedure demo303a(
	$date date
)
begin
	with tmp as  (
		select productid,
		sum(if(year(orderdate)=year($date) and month(orderdate)=month($date), quantity, 0)) as qty1,
		sum(if(orderdate<=last_day($date), quantity, 0)) as qty2
		from orderitems a
		join mysales.orders b using(orderid)
		group by productid
    )
	select a.productid,productname,quantityperunit, photopath, c.companyname as suppliername,c.supplierid,region,city,
    b.unitprice,qty1,qty2 from tmp as a 
    join mysales.products b  using(productid) 
    join mysales.suppliers c using(supplierid);
end $$
delimiter ;
#call demo303a('2019-1-12');

drop procedure if exists demo303b;  #取商品订单信息
delimiter $$
create procedure demo303b(
	$productid varchar(20),
    $date date
)
begin
	select a.*,b.orderdate,b.customerid,c.companyname,b.employeeid,d.employeename from orderitems a
    join mysales.orders b using(orderid)
    join mysales.customers c using(customerid)
    join mysales.employees d using(employeeid)
    where a.productid=$productid and orderdate<=last_day($date);
end $$
delimiter ;

drop procedure if exists demo303c;
delimiter $$
create procedure demo303c(
	$supplierid varchar(20)
)
begin
	select a.*,b.companyname as suppliername,b.region,b.city from products a
    join mysales.suppliers b using(supplierid)
    where a.supplierid=$supplierid;
end $$
delimiter ;

drop procedure if exists demo304a; 
delimiter $$
create procedure demo304a()
begin
	select a.*, b.areaname as region, c.areaname as city from customers a 
    join areas b on a.regionid=b.areaid
    join areas c on a.cityid=c.areaid;
end $$
delimiter ;

drop procedure if exists demo304b; 
delimiter $$
create procedure demo304b(
	$customerid varchar(20),
	$xyear  varchar(10),
	$xmonth varchar(10),
	$pageno int,
    $pagesize int
)
begin
	set @sql=concat("select a.*, b.orderdate, c.productname, c.quantityperunit, c.unit,d.supplierid, d.companyname as suppliername,e.categoryname from orderitems a 
    join mysales.orders b using(orderid)
    join mysales.products c using(productid)
    join mysales.suppliers d using(supplierid)
    join mysales.categories e using(categoryid) where customerid='", $customerid,"'");
    if ($xyear<>'全部') then set @sql=concat(@sql, " and year(orderdate)=", $xyear); end if;
    if ($xmonth<>'全部') then set @sql=concat(@sql, " and month(orderdate)=", $xmonth); end if;
    #select @sql;
    call sys_gridPaging(@sql, $pageno, $pagesize, '','','','');
end $$
delimiter ;
#call demo304b('AHDTSM', 2018, '全部', 2, 20);

drop procedure if exists demo304c; 
delimiter $$
create procedure demo304c(
	$pageno int,
    $pagesize int
)
begin
	declare $limit, $total int;
    drop temporary table if exists tmp;
    create temporary table tmp as select a.*, b.areaname as region, c.areaname as city from customers a 
    join areas b on a.regionid=b.areaid
    join areas c on a.cityid=c.areaid order by a.customerid;	
    if ($pagesize<=0) then 
		select count(*) into $total from tmp;
        select *, $total as '_total' from tmp;  #显示全部记录
    else
		set $pageno=if($pageno<1, 1, $pageno);
        set $limit=($pageno-1)*$pagesize;
        select *, $total as '_total' from tmp limit $limit, $pagesize;  #显示一页记录        
    end if; 
end $$
delimiter ;
#call demo304c(2, 0);

drop procedure if exists demo304d; 
delimiter $$
create procedure demo304d(
	$pageno int,
    $pagesize int,
    $filter varchar(255)
)
begin
	set @sql="select a.*, b.areaname as region, c.areaname as city from customers a 
    join areas b on a.regionid=b.areaid join areas c on a.cityid=c.areaid order by a.customerid";
    call sys_gridPaging(@sql, $pageno, $pagesize, 'customerid','','customerid;companyname;contactname;address;phone', $filter);
end $$
delimiter ;
call demo304d(2, 20,'');

drop procedure if exists demo305a;  
delimiter $$
create procedure demo305a(
	$parentnodeid varchar(20)
)
begin
	select *, areaid as 'value', areaname as 'label' from areas where parentnodeid=$parentnodeid;
end $$
delimiter ;

drop procedure if exists demo306a;
DELIMITER $$
create procedure demo306a()
begin
	select *, categoryid as id, concat(categoryid,' ', categoryname) as 'text', categoryid as 'subcategoryid', categoryid as 'key' from categorytree 
    order by concat(trim(ancestor),id);
end $$
DELIMITER ;

drop procedure if exists demo306b;
DELIMITER $$
create procedure demo306b()
begin
	select categoryid,categoryname, categoryid as id, concat(categoryid,' ', categoryname) as 'text', categoryid as 'key',  parentnodeid, level
    from categorytree
    union all 
    select productid,productname,productid as id, concat(productid,' ',productname) as 'text', productid as 'key', a.SubcategoryID as parentnodeid,
    b.level+1
    from products as a join categorytree as b on a.subcategoryid=b.categoryid;    
end $$
DELIMITER ;


drop procedure if exists demo307a; 
delimiter $$
create procedure demo307a(
	$pageno int,
    $pagesize int,
    $filter varchar(255)
)
begin
	set @sql="select a.*, b.areaname as region, c.areaname as city, d.description as customertype from customers a 
    join areas b on a.regionid=b.areaid
    join areas c on a.cityid=c.areaid
    join customertypes d on d.typeid=a.typeid order by a.customerid";
    call sys_gridPaging(@sql, $pageno, $pagesize, '','','customerid;companyname;contactname;contacttitle;address;email;zip;phone;homepage;region;city', $filter);
end $$
delimiter ;
#call demo307a(2,10,'');

drop procedure if exists demo307b; 
delimiter $$
create procedure demo307b()
begin
	select distinct contacttitle as 'value', contacttitle as 'label', contacttitle from customers;
end $$
delimiter ;

drop procedure if exists demo307c; 
delimiter $$
create procedure demo307c()
begin
	select a.*, typeid as 'value', description as 'label' from customertypes a;
end $$
delimiter ;

drop procedure if exists demo307s; 
delimiter $$
create procedure demo307s(
  $action varchar(20),  
  $data mediumtext
)
begin
	DECLARE $i INT DEFAULT 0;
	DECLARE $field, $value, $keyvalue, $keyfield VARCHAR(255);
    declare $keys,$sql1,$sql2,$sql3 mediumtext default '';
    set $keyfield='customerid';
	-- set $keys=JSON_KEYS($data);  -- 自动获取列    
    set $keys='["zip", "email", "phone", "cityid", "typeid", "address", "homepage", "regionid", "customerid", "taxpayerno", "companyname", "contactname", "contacttitle"]';
   	WHILE $i < JSON_LENGTH($keys) DO
		SET $field = JSON_UNQUOTE(JSON_EXTRACT($keys, CONCAT('$[', $i, ']')));    -- 在这里执行你希望对每个元素值进行的操作, 例如，输出元素值到结果集
        set $value=JSON_UNQUOTE(JSON_EXTRACT($data, CONCAT('$.', $field)));
        if ($field=$keyfield) then set $keyvalue=$value; end if;  -- 记录主键值
        if ($i>0) then
			set $sql1=concat($sql1,',');
			set $sql2=concat($sql2,',');
			set $sql3=concat($sql3,',');
        end if;
		set $sql1=concat($sql1, $field);  -- 生成insert语句中的列名部分
		set $sql2=concat($sql2, '"', $value,'"');  -- 生成insert语句中的列值部分
		set $sql3=concat($sql3, $field, '="', $value, '"');  -- 生成update语句中set 之后部分
		SET $i = $i + 1;
	END WHILE;
    if ($action='edit') then
		set @sql=concat('update customers set ', $sql3, ' where ', $keyfield,'="', $keyvalue, '"');
    else
        set @sql=concat('insert into customers (', $sql1,') values(', $sql2, ')'); 
    end if;
    #select @sql;
    prepare stmt from @sql;
	EXECUTE stmt;
	deallocate prepare stmt;
    select count(*)+1 as _rowno from customers where customerid<$keyvalue;
end $$
delimiter ;
set @data='{"zip":"230001","address":"合肥市包河区商贸市场190-191号",
"customertype":"新客户","city":"合肥市","cityid":"210100","contactname":"张利东","taxpayerno":"",
"total":"112","regionid":"210000","phone":"0551-63668342","companyname":"杨鑫饮料配送中心",
"contacttitle":"销售代表","customerid":"AHYZYL","_pageno":"1","typeid":"1","region":"安徽省","_rowindex":"0","email":"","sysrowno":"5","homepage":"","rowno":5}';
select json_keys(@data) as 'keys', 
json_length(json_keys(@data)) as 'length',
json_extract(json_keys(@data), '$[1]') as 'field',
json_extract(@data,'$.address') as value1,
JSON_UNQUOTE(json_extract(@data,'$.address')) as value2;

drop procedure if exists demo312a; 
delimiter $$
create procedure demo312a(
  $customerid varchar(20)
)
begin
    select a.*, b.companyname from orders a 
    join customers b using(customerid) where a.customerid=$customerid;
end $$
delimiter ;
#call demo312a('AHPPSP');

drop procedure if exists demo312b; 
delimiter $$
create procedure demo312b(
  $orderid int
)
begin
  	select a.*, b.productname, b.unit, b.quantityperunit from orderitems a join products b using (productid)
    where a.orderid = $orderid;
end $$
delimiter ;
#call demo312b(10318);

drop procedure if exists demo312c; 
delimiter $$
create procedure demo312c(
  $customerid varchar(20)
)
begin
  	select a.*, b.productname, b.unit, b.quantityperunit, c.orderdate from orderitems a 
    join products b using (productid)
    join orders c using(orderid)
    where customerid = $customerid order by c.orderid;
end $$
delimiter ;
#call demo312c('AHPPSP');

drop procedure if exists demo313a;
delimiter $$
CREATE PROCEDURE demo313a()
begin
  #select categoryid as id,categoryname as text, parentnodeid from categorytree order by concat(trim(ancestor),id);
  select customerid as 'value', companyname as 'label' from customers;
end$$
DELIMITER ;

drop procedure if exists demo313b;
delimiter $$
CREATE PROCEDURE demo313b()
begin
	SELECT JSON_OBJECTAGG(chr, py) as pycodes FROM sys_pybase;
end$$
DELIMITER ;

drop procedure if exists demo404a; 
delimiter $$
create procedure demo404a(
	$customerid varchar(20),
	$xyear int,
	$xmonth int
)
begin
	select a.*, b.orderdate, c.productname, c.quantityperunit, c.unit from orderitems a 
    join mysales.orders b using(orderid)
    join mysales.products c using(productid)
    where customerid=$customerid and year(orderdate)=$xyear and month(orderdate)=$xmonth;
end $$
delimiter ;
#call demo404a('AHDTSM',2019,10);

drop procedure if exists demo502a; 
delimiter $$
create procedure demo502a(
	$filter varchar(200)
)
begin
	declare $s varchar(200);
    set $s=concat('%',$filter,'%');
	if ($filter='') then 
		select a.*, b.categoryname, c.CompanyName 
        from products a join categories b using(categoryid) join suppliers c using(supplierid) order by a.productid;
	else 
		select a.productID,a.productname,a.quantityperunit,a.unit,a.categoryid,upper(a.supplierid) as supplierid,a.unitprice, a.subcategoryid,
        b.categoryname, c.CompanyName , '2018-10-11' as productiondate
        from products a join categories b using(categoryid) join suppliers c using(supplierid)
        where (a.productname like $s or b.categoryname like $s or a.englishname like $s or a.quantityperunit like $s or c.companyname like $s)
        and productid<60
        order by a.productid;
	end if;
end $$
delimiter ;
call demo502a('2');

drop procedure if exists demo502b; 
delimiter $$
create procedure demo502b(
	$productid int,
    $productname varchar(100),
    $englishname varchar(100),
    $quantityperunit varchar(100),
    $unit varchar(100),
    $unitprice varchar(100),
    $categoryid varchar(100),
    $supplierid varchar(100),
    $addoredit varchar(20)
)
begin
	if ($addoredit='edit') then
		update products set 
        productname=$productname,
        englishname=$englishname,
        quantityperunit=$quantityperunit,
        unit=$unit,
        unitprice=$unitprice,
        categoryid=$categoryid,
        supplierid=$supplierid
        where productid=$productid;
    end if;
    select a.*, b.categoryname, c.CompanyName from products a join categories b using(categoryid) join suppliers c using(supplierid) where productid=$productid;   
end $$
delimiter ;

drop procedure if exists demo502c; 
delimiter $$
create procedure demo502c(
	$data MediumText
)
begin
	call sys_runEditRows('products', 'productid', '', $data, @row);  #row为主键列的值，json格式
    set @s=sys_GetJsonValue(@row, 'productid', 'n');  #提取主键值，n表示数值型数据
    select a.*, b.categoryname, c.CompanyName from products a join categories b using(categoryid) 
    join suppliers c using(supplierid) where productid=@s;
end $$
delimiter ;
set @data='[{"productid":"2","_action":"delete","_reloadrow":0}]';
set @data='[{"productid":"12","productname":"青岛啤酒2","englishname":"Tsintao Beer","quantityperunit":"330ml*6罐","unit":"箱","unitprice":"26.00","categoryid":"A","supplierid":"qtpj","categoryname":"饮料","_action":"update","_reloadrow":1,"_treeflag":0}]';
#call demo502c(@data);

drop procedure if exists demo502d; 
delimiter $$
create procedure demo502d()
begin
	select *, companyname as suppliername, concat('_',supplierid) as 'key' from suppliers;
end $$
delimiter ;

drop procedure if exists demo503a;
DELIMITER $$
create procedure demo503a( #商品分页显示
	$pageno int,
    $pagesize int,
    $keyvalue varchar(255),
    $filter varchar(255)    
)
begin
	set @sql="select a.*,b.companyname as suppliername, b.address, c.categoryname, a.productid as 'key' from products a 
    join suppliers b on a.supplierid=b.supplierid join categories c using(categoryid) order by productid";	    
	call sys_gridPaging(@sql, $pageno, $pagesize,'productid',$keyvalue,'productid;productname;quantityperunit;unit;suppliername', $filter);
end $$
DELIMITER ;
#call demo503a(1,20,'33','统');

drop procedure if exists demo504a; 
delimiter $$
create procedure demo504a(
	$data MediumText
)
begin
	call sys_runEditRows('products', 'productid', '', $data,  @row);  #row为主键列的值，json格式
    set @s=sys_GetJsonValue(@row, '_error', 'c');
    if (@s='' or @s is null) then   
		set @s=sys_GetJsonValue(@row, 'productid', 'n');  #提取主键值，n表示数值型数据
    end if ;
    #select count(*)+1 as _rowno from products where productid<@s;
end $$
delimiter ;
set @data1='[{"productid":"2","_action":"delete","_reloadrow":0}]';
set @data1='[{"productid":"0","productname":"青岛啤酒2","englishname":"Tsintao Beer","quantityperunit":"330ml*6罐","unit":"箱","unitprice":"26.00","categoryid":"A","supplierid":"qtpj","categoryname":"饮料","_action":"add","_reloadrow":1,"_treeflag":0}]';
set @data1='[{"productid":0,"productname":"111","englishname":"111","quantityperunit":"111","unit":"111","unitprice":11,"subcategoryid":"D3","categoryname":"乳制品","supplierid":"DLSP","releasedate":"2023-04-16","categoryid":"D","photopath":[],"_action":"add","_reloadrow":1,"_treeflag":0}]';
#call demo504a(@data1);
#select * from products

drop procedure if exists demo504w;
delimiter $$
CREATE PROCEDURE demo504w()
begin
  select *,categoryid as id,concat(categoryid,' ',categoryname) as text from categorytree order by concat(trim(ancestor),id);
end$$
DELIMITER ;

drop procedure if exists demo505a;
DELIMITER $$
create procedure demo505a()
begin
	select *, categoryid as id, concat(categoryid,' ', categoryname) as 'text', categoryid as 'subcategoryid', categoryid as 'key' from categorytree 
    order by concat(trim(ancestor),id);
end $$
DELIMITER ;
#call demo505a();

drop procedure if exists demo505b;
DELIMITER $$
create procedure demo505b($categoryid varchar(10))
begin
	select * from products where subcategoryid=$categoryid;
end $$
DELIMITER ;

drop procedure if exists demo505c;
DELIMITER $$
create procedure demo505c($categoryid varchar(10))
begin
	select trim(ancestor) into @s1 from categorytree where categoryid=$categoryid;
    select * from products where subcategoryid in (
    select categoryid from categorytree where ancestor like concat(@s1, $categoryid,'#%'));
end $$
DELIMITER ;
#call demo505c('A');


drop procedure if exists demo505d;
DELIMITER $$
create procedure demo505d($filter varchar(255))
begin
	declare $s varchar(255);
    set $s=concat('%', $filter, '%');
    with recursive tmp0 as (
		select * from categorytree where categoryid like $s or categoryname like $s limit 1
    ),tmp as (
		select *, categoryid as id,concat(categoryid,' ',categoryname) as text from tmp0
		union all
		select a.*, a.categoryid as id,concat(a.categoryid,' ',a.categoryname) as text from categorytree as a join tmp as b on a.categoryid=b.parentnodeid
    ) 
    select * from tmp order by concat(trim(ancestor),id);
end $$
DELIMITER ;
#call demo505d('加工');
 
drop procedure if exists demo506a;
DELIMITER $$
create procedure demo506a(
	$parentnodeid varchar(20)
)
begin
	select *, areaid as id, areaname as text from areas where parentnodeid=$parentnodeid;
end $$
DELIMITER ;

drop procedure if exists demo506b;
DELIMITER $$
create procedure demo506b()
begin
	select parentnodeID, level, isparentflag, ancestor, areaid as id, areaname as text from areas
    order by concat(trim(ancestor),id);
    #只提取前2层
    #where parentnodeid=$parentnodeid;
end $$
DELIMITER ;

drop procedure if exists demo507a;
DELIMITER $$
create procedure demo507a()  #一次性展开节点
begin
	select categoryid as id,concat(categoryid, ' ', categoryname) as text, parentnodeid, level, 
    if(isparentflag=0,(select count(*) from products b where b.subcategoryid=a.categoryid),1) as isparentflag,
    ancestor from categorytree a
    union all
    select productid as id,concat(productid,' ', productname) as text, b.categoryid as parentnodeid, 
    b.level+1 as level, 0 as isparentflag, concat(b.ancestor, b.categoryid,'#') as ancestor from products as a
    join categorytree as b on a.subcategoryid=b.categoryid
    order by concat(trim(ancestor),id);
end $$
DELIMITER ;
#call demo505c('A');

drop procedure if exists demo507b;
DELIMITER $$
create procedure demo507b()  #一次性展开节点与分层展开相结合
begin
	select categoryid as id,concat(categoryid, ' ', categoryname) as text, parentnodeid, level, 
    if(isparentflag=0,(select count(*) from products b where b.subcategoryid=a.categoryid),1) as isparentflag,
    ancestor,categoryid,categoryname,englishname,description from categorytree a order by concat(trim(ancestor),id);
end $$
DELIMITER ;
#call demo507b();

drop procedure if exists demo507c;
DELIMITER $$
create procedure demo507c(
	$parentnodeid varchar(255)
)  #一次性展开节点与分层展开相结合
begin
    select a.*,productid as id,concat(productid,' ', productname) as text, a.subcategoryid as parentnodeid, 
    b.level+1 as level, 0 as isparentflag, concat(b.ancestor, b.categoryid,'#') as ancestor,b.categoryname as subcategoryname, c.categoryname,
    d.companyname as suppliername
    from products as a
    join categorytree as b on a.subcategoryid=b.categoryid
    join categories c on c.categoryid=a.categoryid
    join suppliers d using(supplierid)
    where subcategoryid=$parentnodeid
    order by id;
end $$
DELIMITER ;
#call demo507c('');

drop procedure if exists demo507d;
DELIMITER $$
create procedure demo507d( #显示商品的订单信息
	$productid int,
    $date1 date,
    $date2 date    
)  #一次性展开节点与分层展开相结合
begin
	with tmp as (
	select customerid, sum(quantity) as quantity,sum(amount) as amount,round(sum(amount)/sum(quantity),4) as unitprice
    from orders a 
    join orderitems b using(orderid) 
    where productid=$productid and orderdate between $date1 and $date2
    group by a.customerid)
    select a.customerid as id, companyname as text, '' as parentnodeid, 1 as level, 1 as isparentflag, '' as ancestor,
    quantity,amount,unitprice from tmp a join customers b using(customerid)
	union all
    select a.orderid as id, orderdate as text, a.customerid as parentnodeid, 2 as level, 0 as isparentflag, concat(a.customerid,'#') as ancestor,
    b.quantity,b.amount,unitprice from orders a 
    join orderitems b using(orderid) 
    join customers c using(customerid) 
    where productid=$productid and orderdate between $date1 and $date2
    order by concat(trim(ancestor),id);
end $$
DELIMITER ;
#call demo507d(22,'2019-1-1','2019-12-31');

drop procedure if exists demo508a;
DELIMITER $$
create procedure demo508a(
$categoryid varchar(20),
$pageno int, 
$pagesize int, 
$filter varchar(200))
begin
	declare $start int;
    set $start=($pageno-1)*$pagesize;
	create or replace view v1 as select a.*,b.companyname, b.address, c.categoryname from products a join suppliers b on a.supplierid=b.supplierid 
	join categories c using(categoryid) order by productid;
	select trim(ancestor),isparentflag into @s,@x from categorytree where categoryid=$categoryid;
    if ($categoryid='0') then set @sql='select * from v1';
    elseif (@x=0) then set @sql=concat('select * from v1 where subcategoryid="', $categoryid,'"');
    else 
		set @sql=concat('select * from v1 where subcategoryID in (
		select categoryid from categorytree where ancestor like "', @s,$categoryid,'#%")');
    end if;    
    #select @sql;
	call sys_gridPaging(@sql, $pageno, $pagesize,'','','productid;productname;quantityperunit;unit;suppliername', $filter);
end $$
DELIMITER ;
#call demo508a('A101',1,20,'');

drop procedure if exists demo508b;
DELIMITER $$
create procedure demo508b(
  $categoryid varchar(20),
  $pageno int,
  $pagesize int, 
  $filter varchar(200)
)
begin
	declare $start int;
    set $start=($pageno-1)*$pagesize;    
	select trim(ancestor) into @s from categorytree where categoryid=$categoryid;
    create or replace view v1 as select a.*,b.companyname, b.address, c.categoryname from products a join mysales.suppliers b on a.supplierid=b.supplierid join mysales.categories c using(categoryid) order by productid;
	if ($categoryid='0' || $categoryid='') then 
		set @sql=concat("select * from v1");
        call sys_gridPaging(@sql, $pageno, $pagesize,'','','productid;productname;quantityperunit;unit;suppliername', $filter);
    else
		select count(*) into @n from products where subcategoryID in (
		select categoryid from categorytree where ancestor  like concat(@s,$categoryid,'#%'));
        
		select *, @n as total from v1 where subcategoryID in (
		select categoryid from categorytree where ancestor  like concat(@s,$categoryid,'#%'))
		limit $start, $pagesize;
		#set @sql=concat("select a.*,b.companyname, b.address, c.categoryname from products a join mysales.suppliers b on a.supplierid=b.supplierid join mysales.categories c using(categoryid) where subcategoryid='",$categoryid,"' order by productid");
		#call sys_gridPaging(@sql, $pageno, $pagesize,'','','productid;productname;quantityperunit;unit;suppliername', $filter);
    end if;
end $$
DELIMITER ;

drop procedure if exists demo508c;
DELIMITER $$
create procedure demo508c()
begin
	select *, categoryid as id, concat(categoryid,' ', categoryname) as text from categorytree order by concat(trim(ancestor),id);
end $$
DELIMITER ;
#call demo508c();

drop procedure if exists demo508d;
DELIMITER $$
create procedure demo508d(
  $pageno int, 
  $pagesize int, 
  $keyvalue varchar(255),
  $filter varchar(200))
begin
	set @sql=concat("select * from suppliers");
	call sys_gridPaging(@sql, $pageno, $pagesize,'supplierid', $keyvalue,'supplierid;suppliername;address', $filter);
end $$
DELIMITER ;

drop procedure if exists demo601a;
DELIMITER $$
create procedure demo601a(
	$keyvalue varchar(255)
)
begin
	declare $s VARCHAR(255) default '';
    if ($keyvalue<>'') then 
		SELECT trim(ancestor) into $s from categorytree where categoryid=$keyvalue;
    end if;
	select *, categoryid as id, concat(categoryid,' ', categoryname) as text, $s as _ancestor from categorytree order by concat(trim(ancestor),id);
end $$
DELIMITER ;
#call demo601a('A201');

drop procedure if exists demo601b;
DELIMITER $$
create procedure demo601b(
	$parentnodeid varchar(255),
    $keyvalue varchar(255)
)
begin
	#找到某个节点的值，各级父节点及其子节点
    declare $s,$s1,$s2,$s3 varchar(255);
    declare $i,$x1,$x2,$flag int default 1;
    if ($keyvalue='') then
    	select *, categoryid as id, concat(categoryid,' ', categoryname) as text from categorytree where parentnodeid=$parentnodeid
		order by concat(trim(ancestor),id);
    else    
		select categoryid,ancestor into $s1,$s2 from categorytree where categoryid=$keyvalue;
		set @sql='with tmp as (select *, categoryid as id, concat(categoryid," ", categoryname) as text from categorytree)';    
		while $flag=1 do
			set $x2=locate('#', $s2, $x1);
			if ($x2>0) then
				set $s=substring($s2,$x1,$x2-$x1);    /*  H#H1# */
				if ($x1>1) then set @sql=concat(@sql, ' union all '); end if;
				set @sql=concat(@sql, ' select * from tmp where parentnodeid="', $s,'"');
				set $x1=$x2+1;
			else
				set $flag=0;        
			end if;    
		end while;
		set @sql=concat(@sql, ' order by concat(trim(ancestor),id)');     
		#select @sql;
		prepare stmt from @sql;
		EXECUTE stmt;
		deallocate prepare stmt;
    end if;
end $$
DELIMITER ;
#call demo601b('H','D101');

drop procedure if exists demo601c;
DELIMITER $$
create procedure demo601c(
	$parentnodeid varchar(255),
    $keyvalue varchar(255)
)
begin
    declare $s,$s1,$s2,$s3 varchar(255) default '';
    declare $i,$x1,$x2,$flag int default 1;
    declare $cnodes mediumtext;
    set @sql='';
	if ($keyvalue<>'') then
		select categoryid,ancestor into $s1,$s2 from categorytree where categoryid=$keyvalue;
        if ($s1<>'') then
			set @sql=concat(@sql,"with tmp as (select *, categoryid as id, concat(categoryid,'', categoryname) as text,'", $s2, "' as _ancestor from categorytree)");
			while $flag=1 do
				set $x2=locate('#', $s2, $x1);
				if ($x2>0) then
					set $s=substring($s2,$x1,$x2-$x1);    /*  H#H1# */
					if ($x1>1) then set @sql=concat(@sql, ' union all '); end if;
					set @sql=concat(@sql, ' select * from tmp where parentnodeid="', $s,'"');
					set $x1=$x2+1;                
				else
					set $flag=0;        
				end if;    
			end while;
        end if;
    end if;
    if ($x1>1) then set @sql=concat(@sql, ' union all '); end if;
	set @sql=concat(@sql, "select *, categoryid as id, concat(categoryid,' ', categoryname) as text,'",$s2,"' as _ancestor from categorytree where parentnodeid='",$parentnodeid,"'");
	set @sql=concat(@sql, ' order by concat(trim(ancestor),id)');     
	#select @sql;
	prepare stmt from @sql;
	EXECUTE stmt;
	deallocate prepare stmt;    
end $$
DELIMITER ;
call demo601c('','H20302');
 
drop procedure if exists demo602b;
DELIMITER $$
create procedure demo602b($data mediumtext)
begin
    call sys_runEditRows('categorytree', 'categoryid', '', $data, @row); 
    set @s=sys_GetJsonValue(@row, '_error', 'c');  #提取错误信息
    if (@s='' or @s is null) then
		set @s=sys_GetJsonValue(@row, 'categoryid', 'c');  #提取主键值，n表示数值型数据
		select *, categoryid as id, concat(categoryid,' ', categoryname) as text from categorytree where categoryid=@s;
    end if;
end $$
DELIMITER ;
#set @row='[{"categoryid":"e25","categoryname":"555","englishname":"5555","_action":"add","parentnodeid":"E","isparentflag":0,"level":2,"ancestor":"E#","_reloadrow":1,"_treeflag":1,"_treefield":"categoryid"}]';
#call demo602b(@row);

drop procedure if exists demo604a;
delimiter $$
create procedure demo604a( 
    $xdate date,
    $level int
)
begin
	if ($level=1) then
		select distinct orderdate as id, concat(month(orderdate),'月',day(orderdate),'日') as text,
		'' as parentnodeid,1 as level, 1 as isparentflag,'' as ancestor
		from orders where year(orderdate)=year($xdate) and month(orderdate)=month($xdate);
    elseif $level=2 then
		select orderid as id, concat(orderid,' ', companyname) text,
		orderdate as parentnodeid,2 as level, 0 as isparentflag,concat(orderdate,'#') as ancestor,b.companyname,a.*
		from orders a join customers b using(customerid)
		where orderdate=$xdate;
    end if;
end $$
delimiter ;
#call demo604a('2019-12-2',2);

drop procedure if exists demo604c;
delimiter $$
create procedure demo604c( 
    $orderid int
)
begin
	select a.*, b.quantityperunit,b.unit,b.productname, c.companyname as suppliername from orderitems a
    join products b using(productid) 
    join suppliers c using(supplierid) 
    join orders d using(orderid)
    where orderid=$orderid order by a.productid;
end $$
delimiter ;
#call demo604c(10250);

drop procedure if exists demo604d;
delimiter $$
create procedure demo604d( 
    $productid int
)
begin
	if exists (select 1 from products where productid=$productid) then select count(*)+1 as rowno from products where productid<$productid;
    else select 1 as rowno;
    end if;
end $$
delimiter ;

drop procedure if exists demo604e; 
delimiter $$
create procedure demo604e(
	$pageno int,
    $pagesize int,
    $keyvalue varchar(255),
    $filter varchar(255)
)
begin
	set @sql="select a.*, b.areaname as city from customers a join areas b on a.cityid=b.areaid order by a.customerid";
	call sys_gridPaging(@sql, $pageno, $pagesize,'customerid',$keyvalue,'customerid;companyname;address;city', $filter);
end $$
delimiter ;
#call demo604e(1,10,'ZJXSSY','');

drop procedure if exists demo606a;
delimiter $$
create procedure demo606a( 
    $id varchar(20),
    $xyear int
)
begin
	set @s2=-1;
    select trim(ancestor),isparentflag into @s1,@s2 from categorytree where categoryid=$id;
    if (@s2=0) then
		select month(orderdate) as xmonth,sum(quantity) as qty,sum(amount) as amt, sum(amount-quantity*c.unitprice) as profit from orderitems a 
		join orders b using(orderid)
		join products c using(productid) where year(orderdate)=$xyear and productid in (select productid from products where subcategoryid=$id)
		group by month(orderdate);
	else
		select month(orderdate) as xmonth,sum(quantity) as qty,sum(amount) as amt, sum(amount-quantity*c.unitprice) as profit from orderitems a 
		join orders b using(orderid)
		join products c using(productid) where year(orderdate)=$xyear and productid=$id
		group by month(orderdate);
    end if;
end $$
delimiter ;
#call demo606a('A102',2019);

drop procedure if exists demo701a;
DELIMITER $$
create procedure demo701a()
begin
	select areaid as id, areaname as 'text', parentnodeid, isparentflag, level, ancestor from areas
    order by concat(trim(ancestor),id);
end $$
DELIMITER ;
#call demo701a();

drop procedure if exists demo702a;
DELIMITER $$
create procedure demo702a()
begin
	select areaid as id, areaname as 'text', parentnodeid, isparentflag, level, ancestor from areas where level=1
    union all
	select areaid as id, areaname as 'text', parentnodeid, 0, level, ancestor from areas where level=2    
    order by concat(trim(ancestor),id);
end $$
DELIMITER ;
#call demo702a();



drop procedure if exists demo707a;
DELIMITER $$
create procedure demo707a()
begin
	select categoryid as id, concat(categoryid,' ', categoryname) as 'text', concat('_',categoryid) as 'key',
    categoryname as 'label',parentnodeid,level,isparentflag,ancestor from categorytree 
    #where level=1 # and isparentflag=1
    order by concat(trim(ancestor),id);
end $$
DELIMITER ;


drop procedure if exists demo801a;
DELIMITER $$
create procedure demo801a(
	$pageno int,
    $pagesize int,
    $filter varchar(255)
)
begin
	set @sql="select a.*,b.companyname, b.address, c.categoryname from products a join mysales.suppliers b on a.supplierid=b.supplierid join mysales.categories c using(categoryid) order by productid";
	call sys_gridPaging(@sql, $pageno, $pagesize,'productid','','productid;productname;quantityperunit;unit;suppliername', $filter);
end $$
DELIMITER ;
#call demo801a(1,20,'');

drop procedure if exists demo801b; 
delimiter $$
create procedure demo801b(
	$filter varchar(200)
)
begin
	declare $s varchar(200);
    set $s=concat('%',$filter,'%');
	if ($filter='') then 
		select a.*, b.categoryname, c.CompanyName from products a join categories b using(categoryid) join suppliers c using(supplierid) order by a.productid;
	else 
		select a.*, b.categoryname, c.CompanyName from products a join categories b using(categoryid) join suppliers c using(supplierid)
        where a.productname like $s or b.categoryname like $s or a.englishname like $s or a.quantityperunit like $s or c.companyname like $s order by a.productid;
	end if;
end $$
delimiter ;

drop procedure if exists demo803a;
DELIMITER $$
create procedure demo803a()
begin
	select *, categoryid as id, concat(categoryid,' ', categoryname) as 'text', categoryid as 'subcategoryid', categoryid as 'key' from categorytree 
    order by concat(trim(ancestor),id);
end $$
DELIMITER ;

drop procedure if exists demo803b;
DELIMITER $$
create procedure demo803b()
begin
	select categoryid, categoryname, englishname, ParentNodeID, categoryid as id, concat(categoryid,' ', categoryname) as 'text', categoryid as 'key' 
    from categorytree order by id;
end $$
DELIMITER ;

drop procedure if exists demo803c;
DELIMITER $$
create procedure demo803c($filter varchar(255), $rowno int)
begin
	declare $s varchar(255);
    declare $start int;
    set $start=$rowno-1;
    if $start<0 then set $start=0; end if;
    set $s=concat('%', $filter, '%');
	select *,categoryid as id from categorytree where categoryid like $s or categoryname like $s limit $start,1;
end $$
DELIMITER ;

drop procedure if exists demo804a;
DELIMITER $$
create procedure demo804a(
	$parentnodeid varchar(100)
)
begin
	select *, categoryid as id, concat(categoryid,' ', categoryname) as 'text', categoryid as 'subcategoryid', categoryid as 'key' from categorytree 
    where parentnodeid=$parentnodeid
    order by concat(trim(ancestor),id);
end $$
DELIMITER ;

drop procedure if exists demo804c;
DELIMITER $$
create procedure demo804c($filter varchar(255))
begin
	declare $s varchar(255);
    set $s=concat('%', $filter, '%');
    with recursive tmp0 as (
		select * from areas where areaid like $s or areaname like $s limit 1
    ),tmp as (
		select *, areaid as id,areaname as text from tmp0
		union all
		select a.*, a.areaid as id, a.areaname as text from areas as a join tmp as b on a.areaid=b.parentnodeid
    ) 
    select * from tmp order by concat(trim(ancestor),areaid);
end $$
DELIMITER ;
#call demo804c('余姚');

drop procedure if exists demo804d;
DELIMITER $$
create procedure demo804d($filter varchar(255),$rowno int)
begin
	declare $s varchar(255);
    declare $start int;
    set $start=$rowno-1;
    if $start<0 then set $start=0; end if;
    set $s=concat('%', $filter, '%');
	select *, categoryid as id, concat(categoryid,' ',CategoryName) as 'text' from categorytree 
    where categoryname like $s or categoryid like $s or englishname like $s limit $start,1;
    /*
	with recursive tmp0 as (
		select *, categoryid as id, concat(categoryid,' ',CategoryName) as 'text' from categorytree where categoryname like $s or categoryid like $s or englishname like $s limit $start,1
    ),tmp as (
		select * from tmp0
		union all
		select a.*, a.categoryid as id, concat(a.categoryid,' ', a.CategoryName) as 'text' from categorytree as a join tmp as b on a.categoryid=b.parentnodeid
    ) 
    select * from tmp order by concat(trim(ancestor), id); 
    */
 end $$
DELIMITER ;
call demo804d('鲜',1);

drop procedure if exists demo804e;
DELIMITER $$
create procedure demo804e($filter varchar(255))
begin
	declare $s varchar(255);
    set $s=concat('%', $filter, '%');
	select *, categoryid as id, concat(categoryid,' ',CategoryName) as 'text' from categorytree 
    where categoryname like $s or categoryid like $s or englishname like $s;
 end $$
DELIMITER ;
call demo804e('鲜');

drop procedure if exists demo805d;
DELIMITER $$
create procedure demo805d(
	$filter varchar(255),
	$rowno int
)
begin
	declare $s varchar(255);
    declare $start int;
    set $start=$rowno-1;
    if $start<0 then set $start=0; end if;
    set $s=concat('%', $filter, '%');
	select ancestor,categoryid as id,categoryname from categorytree where categoryid like $s or categoryname like $s
    union all
	select concat(b.ancestor,a.subcategoryid,'#') as ancestor,productid as id,productname from products a
    join categorytree b on b.categoryid=a.subcategoryid where productid like $s or productname like $s or quantityperunit like $s or unit like $s
    limit $start,1;    
end $$
DELIMITER ;
call demo805d('辣',2);

drop procedure if exists demo806b;
delimiter $$
create procedure demo806b($parentnodeid varchar(100))
begin
	with tmp as (
		select distinct concat(year(orderdate),'-', 100+month(orderdate)) as id,concat(year(orderdate),'-',month(orderdate)) as 'key', 
        concat(year(orderdate),'年', month(orderdate),'月') as text, 
		'' as parentnodeid, 1 as level, 1 as isparentflag, '' as ancestor from orders as a where year(orderdate)=2019
		union all
		select distinct orderdate as id,orderdate as 'key', concat(month(orderdate),'月', day(orderdate),'日') as text, 
		concat(year(orderdate),'-', 100+month(orderdate)) as parentnodeid, 2 as level, 1 as isparentflag, concat(year(orderdate),'-',month(orderdate))+'#' as ancestor from orders as a 
		where year(orderdate)=2019
    	union all
    	select a.orderid as id, a.orderid as 'key', concat(a.orderid, ' ', a.customerid, ' ', b.companyname) as text,
		cast(orderdate as char(10)) as parentnodeid, 3 as level, 0 as isparentflag, concat(year(orderdate),'-', 100+month(orderdate),'#', orderdate,'#') as ancestor
		from orders as a
		join customers as b using(customerid) 
      	where year(orderdate)=2019
        order by concat(trim(ancestor), id)
        )
        select * from tmp where parentnodeid=$parentnodeid;
end $$
delimiter ;
#call demo806b('2019-102');

drop procedure if exists demo901a; 
delimiter $$
create procedure demo901a(
	$data MediumText
)
begin
	call sys_runEditRow('products', 'productid', '', $data,  @row);  #row为主键列的值，json格式
    set @s=sys_GetJsonValue(@row, '_error', 'c');
    if (@s='' or @s is null) then   
		set @s=sys_GetJsonValue(@row, 'productid', 'n');  #提取主键值，n表示数值型数据
    end if ;
    #select count(*)+1 as _rowno from products where productid<@s;
end $$
delimiter ;

drop procedure if exists demo904a;
delimiter $$
create procedure demo904a(
	$year int,  #select last_day('2019-8-11')
    $month int,    
	$pageno int,
    $pagesize int,
    $keyvalue varchar(255),
    $filter varchar(255)    
)
begin
	set @sql=concat("
	with tmp as  (
		select productid,
		sum(if(year(orderdate)=", $year, " and month(orderdate)=", $month, ", quantity, 0)) as qty1,
		sum(if(orderdate<=last_day(concat('",$year,"-,",$month,"-01')), quantity, 0)) as qty2
		from orderitems a
		join orders b using(orderid)
		group by productid
    )
	select b.*, c.companyname as suppliername, region,city,d.categoryname,
    a.qty1, a.qty2, b.productid as 'key' from tmp as a 
    right join products b using(productid) 
    left join suppliers c using(supplierid)
    left join categories d using(categoryid)
    order by b.productid");
	call sys_gridPaging(@sql, $pageno, $pagesize,'productid',$keyvalue,'productid;productname;quantityperunit;unit;suppliername', $filter);    
    
end $$
delimiter ;
#call demo904a(2018,12, 2,20,'','');

drop procedure if exists demo905b; 
delimiter $$
create procedure demo905b(
	$data MediumText
)
begin
	call sys_runEditRow('products', 'productid', '', $data,  @row);  #row为主键列的值，json格式
    #select @row;
    set @s=sys_GetJsonValue(@row, '_error', 'c');
    #select @s;
    if (@s='' or @s is null) then   
		set @s=sys_GetJsonValue(@row, 'productid', 'n');  #提取主键值，n表示数值型数据
    end if ;
    #select count(*)+1 as _rowno from products where productid<@s;
end $$
delimiter ;
set @data1='[{"productid":"2","_action":"delete","_reloadrow":0}]';
set @data1='{"productid":"6","productname":"康师傅矿泉水","englishname":"Master.Kong Mineral Water","quantityperunit":"500ml*6瓶","unit":"箱","unitprice":"12.00","subcategoryid":"A3","categoryname":"饮料","supplierid":"KSF","releasedate":"2014-11-13","categoryid":"A","photopath":[{"filename":"mybase/products/6.jpg","name":"图片"}],"_action":"update","_reloadrow":1,"_treeflag":0}';
set @data1='[{"productid":"111","productname":"11","englishname":"11","quantityperunit":"11","unit":"11","unitprice":11,"subcategoryid":"C3","categoryname":"糖果蜜饯","supplierid":"BCWSP","releasedate":"2023-04-04","categoryid":"C","photopath":[{"filename":"mybase/resources/tmp_202304291682746460646.jpg","name":"“一亩田“共享农田平台--严偲仪、刘喜梅、冯颖蔚.jpg"},{"filename":"mybase/resources/tmp_202304291682746462880.jpg","name":"1207双万指导照片1.jpg"}],"_action":"add","_reloadrow":1,"_treeflag":0}]';
#call demo905b(@data1);
#select * from products

drop procedure if exists demo905c; 
delimiter $$
create procedure demo905c(
	$data MediumText
)
begin
	call sys_runEditRow('products', 'productid', '', $data, @row);  #row为主键列的值，json格式
    set @s=sys_GetJsonValue(@row, 'productid', 'n');  #提取主键值，n表示数值型数据
    select a.*, b.categoryname, c.CompanyName from products a join categories b using(categoryid) 
    join suppliers c using(supplierid) where productid=@s;
end $$
delimiter ;
set @data='[{"productid":"2","_action":"delete","_reloadrow":0}]';
set @data='[{"productid":"12","productname":"青岛啤酒2","englishname":"Tsintao Beer","quantityperunit":"330ml*6罐","unit":"箱","unitprice":"26.00","categoryid":"A","supplierid":"qtpj","categoryname":"饮料","_action":"update","_reloadrow":1,"_treeflag":0}]';
#call demo905cc(@data);

drop procedure if exists demo906a;
DELIMITER $$
create procedure demo906a(
	$pageno int,
    $pagesize int,
    $keyvalue varchar(255),
    $filter varchar(255)    
)
begin
set @sql="
	select a.*, concat(customerid,'_',b.companyname) as customer, employeename, concat(employeeid,employeename) as employee,concat(shipperid,d.companyname) as shipper from orders a
    join customers b using(customerid)
    join employees c using(employeeid)
    join shippers d using(shipperid)";    
    call sys_gridPaging(@sql, $pageno, $pagesize,'orderid',$keyvalue,'orderid;orderdate;customer;employee;shipper', $filter);
end $$    
DELIMITER ;
#call demo906a(1,10,'','');

drop procedure if exists demo907a;
DELIMITER $$
create procedure demo907a(
)
begin
	select distinct type, type as 'key' from dictionary order by rowid;
end $$    
DELIMITER ;


drop procedure if exists demo907b;
delimiter $$
create procedure demo907b(
	$data MediumText
)
begin
	declare $row,$row0 mediumtext;
    declare $s,$s0,$action varchar(255);
    set $row=json_extract($data,'$[0]');
    set $row0=json_extract($data,'$[1]');
    set $s=sys_GetJsonValue($row, 'type', 'c');
    set $s0=sys_GetJsonValue($row0, 'type', 'c');
    set $action=sys_GetJsonValue($row, '_action', 'c');
    select $s,$action,$row;
    if ($action='update') then
		update dictionary set type=$s where type=$s0;
        with tmp as (select distinct type from dictionary),
        tmp1 as (select *, row_number() over() as _rowno from tmp)
        select * from tmp1 where type=$s;        
    elseif($action='delete') then
		delete from dictionary where type=$s;
    elseif($action='add') then
		insert into dictionary (type) value($s);
        with tmp as (select distinct type from dictionary),
        tmp1 as (select *, row_number() over() as _rowno from tmp)
        select * from tmp1 where type=$s;
        #call sys_runEditRows('dictionary', 'type', '', $data, @row);  #row为主键列的值，json格式
		#set @s=sys_GetJsonValue(@row, 'type', 'n');  #提取主键值，n表示数值型数据
    end if;
end $$
delimiter ;
set @data='[{"type":"职称1","_action":"update","_reloadrow":1,"_treeflag":0},{"type":"职称"}]';
set @data='[{"type":"eeeee","key":"eeeee","sysrowno":"14","_action":"delete","_reloadrow":0}]';
#call demo907b(@data);
#select* from dictionary;

drop procedure if exists demo907d;
DELIMITER $$
create procedure demo907d(
	$type varchar(100)
)
begin
	select * from dictionary where type=$type order by sortflag,rowid;
end $$    
DELIMITER ;


drop procedure if exists demo907e; 
delimiter $$
create procedure demo907e(
	$data MediumText
)
begin
	declare $row mediumtext;
	declare $type varchar(255);
    declare $rowid bigint;
    declare $sortflag int;
    set $row=json_extract($data,'$[0]');   #需要新插入或修改的数据
    set $sortflag=sys_GetJsonValue($row, 'sortflag', 'n'); 
    set $type=sys_GetJsonValue($row, 'type', 'c');
	call sys_runEditRow('dictionary', 'rowid', '', $data, @row);  #row为主键列的值，json格式
    #select @row;
    #找到记录的排序位置，以便选中记录
    set $rowid=sys_GetJsonValue(@row, 'rowid', 'n');
    with tmp as (select *,row_number() over(order by sortflag,rowid) as _rowno, '' as '_error' from dictionary where type=$type)
    select * from tmp where rowid=$rowid;     
end $$
delimiter ;
set @data='[{"title":"66677","code":"666","sortflag":"6","_action":"add","_reloadrow":1,"_treeflag":0,"type":"难度等级"}]';
set @data='[{"title":"如45345555","code":"5555","sortflag":"5","rowid":"103","_action":"update","_reloadrow":1,"_treeflag":0,"type":"难度等级"},{"title":"如45345555555","code":"5555","sortflag":"5","rowid":"103"}]';
#call demo907e(@data);
#select * from dictionary;

drop procedure if exists demo1001a;
DELIMITER $$
create procedure demo1001a( 
	$pageno int,
    $pagesize int,
    $keyvalue varchar(255),
    $filter varchar(255)    
)
begin
	set @sql="select a.*,b.companyname as suppliername, b.address, c.categoryname, a.productid as 'key' from products a 
    join suppliers b on a.supplierid=b.supplierid join categories c using(categoryid) order by productid";	    
	call sys_gridPaging(@sql, $pageno, $pagesize,'productid',$keyvalue,'SubcategoryID', $filter);
end $$
DELIMITER ;

drop procedure if exists demo1001b;
DELIMITER $$
create procedure demo1001b(
	$data mediumtext
)
begin
    call sys_runEditRow('categorytree', 'categoryid', '', $data, @row); 
    set @s=sys_GetJsonValue(@row, '_error', 'c');  #提取错误信息
    #select @row,@s;
    if (@s='' or @s is null) then
		set @s=sys_GetJsonValue(@row, 'categoryid', 'c');  #提取主键值，n表示数值型数据
		select *, categoryid as id,  categoryid as 'key', concat(categoryid,' ', categoryname) as text from categorytree where categoryid=@s;
    end if;
end $$
DELIMITER ;
set @data='[{"categoryid":"A1","categoryname":"非酒精饮料33366","englishname":"Non-alcoholic beverages","_action":"update","parentnodeid":"A","isparentflag":"1","level":"2","ancestor":"A#","_reloadrow":1,"_treeflag":1,"_treefield":"categoryid"},{"categoryid":"A1","categoryname":"非酒精饮料333","englishname":"Non-alcoholic beverages"}]';
#call demo1001b(@data);

drop procedure if exists demo1003a;
DELIMITER $$
create procedure demo1003a()
begin
	#select *, contentid as id, contentid as 'key', contenttitle as text from contents;
	select contentid as id, contentid as 'key', contenttitle as text,parentnodeid from contents;    
end $$
DELIMITER ;

drop procedure if exists demo1003b;
DELIMITER $$
create procedure demo1003b(	$data mediumtext)
begin
	truncate table contents;
    insert into contents (contentid, contenttitle,parentnodeid,level,isparentflag, ancestor)
	SELECT * FROM JSON_TABLE($data, "$[*]" COLUMNS(
	contentid char(10) PATH "$.id", 
	contenttitle varchar(200) PATH "$.text", 
	parentnodeid varchar(200) PATH "$.parentnodeid", 
	level int PATH "$.level", 
	isparentflag int PATH "$.isparentflag", 
	ancestor varchar(200) PATH "$.ancestor"
    )
) as p;
end $$
DELIMITER ;
set @data='[{"_sysrowno":"1","id":"1","text":"第1章 数据库系统基础","key":"1","parentnodeid":"","isparentflag":1,"level":1,"ancestor":"","children":[{"_sysrowno":"2","id":"1.1","text":"1.1 数据库简介","key":"1.1","parentnodeid":"1","isparentflag":1,"level":2,"ancestor":"1#","children":[{"_sysrowno":"3","id":"1.1.1","text":"1.1.1 数据库基本概念","key":"1.1.1","parentnodeid":"1.1","isparentflag":0,"level":3,"ancestor":"1#1.1#"},{"_sysrowno":"4","id":"1.1.2","text":"1.1.2 数据库技术的产生和发展","key":"1.1.2","parentnodeid":"1.1","isparentflag":0,"level":3,"ancestor":"1#1.1#"}],"_childno":3},{"_sysrowno":"5","id":"1.2","text":"1.2 数据模型与概念模型","key":"1.2","parentnodeid":"1","isparentflag":1,"level":2,"ancestor":"1#","children":[{"_sysrowno":"6","id":"1.2.1","text":"1.2.1 概念模型","key":"1.2.1","parentnodeid":"1.2","isparentflag":0,"level":3,"ancestor":"1#1.2#"},{"_sysrowno":"7","id":"1.2.2","text":"1.2.2 数据模型","key":"1.2.2","parentnodeid":"1.2","isparentflag":0,"level":3,"ancestor":"1#1.2#"},{"_sysrowno":"8","id":"1.2.3","text":"1.2.3 关系模型的优缺点","key":"1.2.3","parentnodeid":"1.2","isparentflag":0,"level":3,"ancestor":"1#1.2#"}],"_childno":4},{"_sysrowno":"9","id":"1.3","text":"1.3 数据库管理系统","key":"1.3","parentnodeid":"1","isparentflag":1,"level":2,"ancestor":"1#","children":[{"_sysrowno":"10","id":"1.3.1","text":"1.3.1 数据库管理系统的功能","key":"1.3.1","parentnodeid":"1.3","isparentflag":0,"level":3,"ancestor":"1#1.3#"},{"_sysrowno":"11","id":"1.3.2","text":"1.3.2 数据库管理系统的组成","key":"1.3.2","parentnodeid":"1.3","isparentflag":0,"level":3,"ancestor":"1#1.3#"},{"_sysrowno":"12","id":"1.3.3","text":"1.3.3 关系数据库管理系统实例","key":"1.3.3","parentnodeid":"1.3","isparentflag":0,"level":3,"ancestor":"1#1.3#"}],"_childno":4},{"_sysrowno":"13","id":"1.4","text":"1.4 数据库应用系统的结构","key":"1.4","parentnodeid":"1","isparentflag":1,"level":2,"ancestor":"1#","children":[{"_sysrowno":"14","id":"1.4.1","text":"1.4.1 数据库应用系统的组成","key":"1.4.1","parentnodeid":"1.4","isparentflag":0,"level":3,"ancestor":"1#1.4#"},{"_sysrowno":"15","id":"1.4.2","text":"1.4.2 数据库应用系统的三级数据模式结构","key":"1.4.2","parentnodeid":"1.4","isparentflag":0,"level":3,"ancestor":"1#1.4#"},{"_sysrowno":"16","id":"1.4.3","text":"1.4.3 数据库应用系统的体系结构","key":"1.4.3","parentnodeid":"1.4","isparentflag":0,"level":3,"ancestor":"1#1.4#"},{"_sysrowno":"17","id":"1.4.4","text":"1.4.4 数据库的设计过程","key":"1.4.4","parentnodeid":"1.4","isparentflag":0,"level":3,"ancestor":"1#1.4#"}],"_childno":5},{"_sysrowno":"18","id":"1.5","text":"1.5 数据库技术的研究与发展方向","key":"1.5","parentnodeid":"1","isparentflag":1,"level":2,"ancestor":"1#","children":[{"_sysrowno":"19","id":"1.5.1","text":"1.5.1 传统数据库技术的局限性","key":"1.5.1","parentnodeid":"1.5","isparentflag":0,"level":3,"ancestor":"1#1.5#"},{"_sysrowno":"20","id":"1.5.2","text":"1.5.2 第三代数据库系统","key":"1.5.2","parentnodeid":"1.5","isparentflag":0,"level":3,"ancestor":"1#1.5#"},{"_sysrowno":"21","id":"1.5.3","text":"1.5.3 数据库技术与其他相关技术的结合","key":"1.5.3","parentnodeid":"1.5","isparentflag":0,"level":3,"ancestor":"1#1.5#"}],"_childno":4},{"_sysrowno":"22","id":"1.6","text":"1.x 习题","key":"1.6","parentnodeid":"1","isparentflag":0,"level":2,"ancestor":"1#"}],"_childno":7},{"_sysrowno":"2","id":"1.1","text":"1.1 数据库简介","key":"1.1","parentnodeid":"1","isparentflag":1,"level":2,"ancestor":"1#","children":[{"_sysrowno":"3","id":"1.1.1","text":"1.1.1 数据库基本概念","key":"1.1.1","parentnodeid":"1.1","isparentflag":0,"level":3,"ancestor":"1#1.1#"},{"_sysrowno":"4","id":"1.1.2","text":"1.1.2 数据库技术的产生和发展","key":"1.1.2","parentnodeid":"1.1","isparentflag":0,"level":3,"ancestor":"1#1.1#"}],"_childno":3},{"_sysrowno":"3","id":"1.1.1","text":"1.1.1 数据库基本概念","key":"1.1.1","parentnodeid":"1.1","isparentflag":0,"level":3,"ancestor":"1#1.1#"},{"_sysrowno":"4","id":"1.1.2","text":"1.1.2 数据库技术的产生和发展","key":"1.1.2","parentnodeid":"1.1","isparentflag":0,"level":3,"ancestor":"1#1.1#"},{"_sysrowno":"5","id":"1.2","text":"1.2 数据模型与概念模型","key":"1.2","parentnodeid":"1","isparentflag":1,"level":2,"ancestor":"1#","children":[{"_sysrowno":"6","id":"1.2.1","text":"1.2.1 概念模型","key":"1.2.1","parentnodeid":"1.2","isparentflag":0,"level":3,"ancestor":"1#1.2#"},{"_sysrowno":"7","id":"1.2.2","text":"1.2.2 数据模型","key":"1.2.2","parentnodeid":"1.2","isparentflag":0,"level":3,"ancestor":"1#1.2#"},{"_sysrowno":"8","id":"1.2.3","text":"1.2.3 关系模型的优缺点","key":"1.2.3","parentnodeid":"1.2","isparentflag":0,"level":3,"ancestor":"1#1.2#"}],"_childno":4},{"_sysrowno":"6","id":"1.2.1","text":"1.2.1 概念模型","key":"1.2.1","parentnodeid":"1.2","isparentflag":0,"level":3,"ancestor":"1#1.2#"},{"_sysrowno":"7","id":"1.2.2","text":"1.2.2 数据模型","key":"1.2.2","parentnodeid":"1.2","isparentflag":0,"level":3,"ancestor":"1#1.2#"},{"_sysrowno":"8","id":"1.2.3","text":"1.2.3 关系模型的优缺点","key":"1.2.3","parentnodeid":"1.2","isparentflag":0,"level":3,"ancestor":"1#1.2#"},{"_sysrowno":"9","id":"1.3","text":"1.3 数据库管理系统","key":"1.3","parentnodeid":"1","isparentflag":1,"level":2,"ancestor":"1#","children":[{"_sysrowno":"10","id":"1.3.1","text":"1.3.1 数据库管理系统的功能","key":"1.3.1","parentnodeid":"1.3","isparentflag":0,"level":3,"ancestor":"1#1.3#"},{"_sysrowno":"11","id":"1.3.2","text":"1.3.2 数据库管理系统的组成","key":"1.3.2","parentnodeid":"1.3","isparentflag":0,"level":3,"ancestor":"1#1.3#"},{"_sysrowno":"12","id":"1.3.3","text":"1.3.3 关系数据库管理系统实例","key":"1.3.3","parentnodeid":"1.3","isparentflag":0,"level":3,"ancestor":"1#1.3#"}],"_childno":4},{"_sysrowno":"10","id":"1.3.1","text":"1.3.1 数据库管理系统的功能","key":"1.3.1","parentnodeid":"1.3","isparentflag":0,"level":3,"ancestor":"1#1.3#"},{"_sysrowno":"11","id":"1.3.2","text":"1.3.2 数据库管理系统的组成","key":"1.3.2","parentnodeid":"1.3","isparentflag":0,"level":3,"ancestor":"1#1.3#"},{"_sysrowno":"12","id":"1.3.3","text":"1.3.3 关系数据库管理系统实例","key":"1.3.3","parentnodeid":"1.3","isparentflag":0,"level":3,"ancestor":"1#1.3#"},{"_sysrowno":"13","id":"1.4","text":"1.4 数据库应用系统的结构","key":"1.4","parentnodeid":"1","isparentflag":1,"level":2,"ancestor":"1#","children":[{"_sysrowno":"14","id":"1.4.1","text":"1.4.1 数据库应用系统的组成","key":"1.4.1","parentnodeid":"1.4","isparentflag":0,"level":3,"ancestor":"1#1.4#"},{"_sysrowno":"15","id":"1.4.2","text":"1.4.2 数据库应用系统的三级数据模式结构","key":"1.4.2","parentnodeid":"1.4","isparentflag":0,"level":3,"ancestor":"1#1.4#"},{"_sysrowno":"16","id":"1.4.3","text":"1.4.3 数据库应用系统的体系结构","key":"1.4.3","parentnodeid":"1.4","isparentflag":0,"level":3,"ancestor":"1#1.4#"},{"_sysrowno":"17","id":"1.4.4","text":"1.4.4 数据库的设计过程","key":"1.4.4","parentnodeid":"1.4","isparentflag":0,"level":3,"ancestor":"1#1.4#"}],"_childno":5},{"_sysrowno":"14","id":"1.4.1","text":"1.4.1 数据库应用系统的组成","key":"1.4.1","parentnodeid":"1.4","isparentflag":0,"level":3,"ancestor":"1#1.4#"},{"_sysrowno":"15","id":"1.4.2","text":"1.4.2 数据库应用系统的三级数据模式结构","key":"1.4.2","parentnodeid":"1.4","isparentflag":0,"level":3,"ancestor":"1#1.4#"},{"_sysrowno":"16","id":"1.4.3","text":"1.4.3 数据库应用系统的体系结构","key":"1.4.3","parentnodeid":"1.4","isparentflag":0,"level":3,"ancestor":"1#1.4#"},{"_sysrowno":"17","id":"1.4.4","text":"1.4.4 数据库的设计过程","key":"1.4.4","parentnodeid":"1.4","isparentflag":0,"level":3,"ancestor":"1#1.4#"},{"_sysrowno":"18","id":"1.5","text":"1.5 数据库技术的研究与发展方向","key":"1.5","parentnodeid":"1","isparentflag":1,"level":2,"ancestor":"1#","children":[{"_sysrowno":"19","id":"1.5.1","text":"1.5.1 传统数据库技术的局限性","key":"1.5.1","parentnodeid":"1.5","isparentflag":0,"level":3,"ancestor":"1#1.5#"},{"_sysrowno":"20","id":"1.5.2","text":"1.5.2 第三代数据库系统","key":"1.5.2","parentnodeid":"1.5","isparentflag":0,"level":3,"ancestor":"1#1.5#"},{"_sysrowno":"21","id":"1.5.3","text":"1.5.3 数据库技术与其他相关技术的结合","key":"1.5.3","parentnodeid":"1.5","isparentflag":0,"level":3,"ancestor":"1#1.5#"}],"_childno":4},{"_sysrowno":"19","id":"1.5.1","text":"1.5.1 传统数据库技术的局限性","key":"1.5.1","parentnodeid":"1.5","isparentflag":0,"level":3,"ancestor":"1#1.5#"},{"_sysrowno":"20","id":"1.5.2","text":"1.5.2 第三代数据库系统","key":"1.5.2","parentnodeid":"1.5","isparentflag":0,"level":3,"ancestor":"1#1.5#"},{"_sysrowno":"21","id":"1.5.3","text":"1.5.3 数据库技术与其他相关技术的结合","key":"1.5.3","parentnodeid":"1.5","isparentflag":0,"level":3,"ancestor":"1#1.5#"},{"_sysrowno":"22","id":"1.6","text":"1.x 习题","key":"1.6","parentnodeid":"1","isparentflag":0,"level":2,"ancestor":"1#"},{"_sysrowno":"23","id":"2","text":"第2章 关系数据库","key":"2","parentnodeid":"","isparentflag":1,"level":1,"ancestor":"","children":[{"_sysrowno":"24","id":"2.1","text":"2.1 关系数据结构","key":"2.1","parentnodeid":"2","isparentflag":1,"level":2,"ancestor":"2#","children":[{"_sysrowno":"25","id":"2.1.1","text":"2.1.1 关系","key":"2.1.1","parentnodeid":"2.1","isparentflag":0,"level":3,"ancestor":"2#2.1#"},{"_sysrowno":"26","id":"2.1.2","text":"2.1.2 关系模式","key":"2.1.2","parentnodeid":"2.1","isparentflag":0,"level":3,"ancestor":"2#2.1#"},{"_sysrowno":"27","id":"2.1.3","text":"2.1.3 关系数据库","key":"2.1.3","parentnodeid":"2.1","isparentflag":0,"level":3,"ancestor":"2#2.1#"}],"_childno":4},{"_sysrowno":"28","id":"2.2","text":"2.2 关系操作概述","key":"2.2","parentnodeid":"2","isparentflag":0,"level":2,"ancestor":"2#"},{"_sysrowno":"29","id":"2.3","text":"2.3 关系的完整性","key":"2.3","parentnodeid":"2","isparentflag":0,"level":2,"ancestor":"2#"},{"_sysrowno":"30","id":"2.4","text":"2.4 关系代数","key":"2.4","parentnodeid":"2","isparentflag":1,"level":2,"ancestor":"2#","children":[{"_sysrowno":"31","id":"2.4.1","text":"2.4.1 集合运算","key":"2.4.1","parentnodeid":"2.4","isparentflag":0,"level":3,"ancestor":"2#2.4#"},{"_sysrowno":"32","id":"2.4.2","text":"2.4.2 专门的关系运算","key":"2.4.2","parentnodeid":"2.4","isparentflag":0,"level":3,"ancestor":"2#2.4#"}],"_childno":3},{"_sysrowno":"33","id":"2.5","text":"2.5 查询优化","key":"2.5","parentnodeid":"2","isparentflag":1,"level":2,"ancestor":"2#","children":[{"_sysrowno":"34","id":"2.5.1","text":"2.5.1 查询优化概述","key":"2.5.1","parentnodeid":"2.5","isparentflag":0,"level":3,"ancestor":"2#2.5#"},{"_sysrowno":"35","id":"2.5.2","text":"2.5.2 查询优化的一般准则","key":"2.5.2","parentnodeid":"2.5","isparentflag":0,"level":3,"ancestor":"2#2.5#"},{"_sysrowno":"36","id":"2.5.3","text":"2.5.3 关系代数等价变换规则","key":"2.5.3","parentnodeid":"2.5","isparentflag":0,"level":3,"ancestor":"2#2.5#"}],"_childno":4},{"_sysrowno":"37","id":"2.6","text":"2.x 习题","key":"2.6","parentnodeid":"2","isparentflag":0,"level":2,"ancestor":"2#"}],"_childno":7},{"_sysrowno":"24","id":"2.1","text":"2.1 关系数据结构","key":"2.1","parentnodeid":"2","isparentflag":1,"level":2,"ancestor":"2#","children":[{"_sysrowno":"25","id":"2.1.1","text":"2.1.1 关系","key":"2.1.1","parentnodeid":"2.1","isparentflag":0,"level":3,"ancestor":"2#2.1#"},{"_sysrowno":"26","id":"2.1.2","text":"2.1.2 关系模式","key":"2.1.2","parentnodeid":"2.1","isparentflag":0,"level":3,"ancestor":"2#2.1#"},{"_sysrowno":"27","id":"2.1.3","text":"2.1.3 关系数据库","key":"2.1.3","parentnodeid":"2.1","isparentflag":0,"level":3,"ancestor":"2#2.1#"}],"_childno":4},{"_sysrowno":"25","id":"2.1.1","text":"2.1.1 关系","key":"2.1.1","parentnodeid":"2.1","isparentflag":0,"level":3,"ancestor":"2#2.1#"},{"_sysrowno":"26","id":"2.1.2","text":"2.1.2 关系模式","key":"2.1.2","parentnodeid":"2.1","isparentflag":0,"level":3,"ancestor":"2#2.1#"},{"_sysrowno":"27","id":"2.1.3","text":"2.1.3 关系数据库","key":"2.1.3","parentnodeid":"2.1","isparentflag":0,"level":3,"ancestor":"2#2.1#"},{"_sysrowno":"28","id":"2.2","text":"2.2 关系操作概述","key":"2.2","parentnodeid":"2","isparentflag":0,"level":2,"ancestor":"2#"},{"_sysrowno":"29","id":"2.3","text":"2.3 关系的完整性","key":"2.3","parentnodeid":"2","isparentflag":0,"level":2,"ancestor":"2#"},{"_sysrowno":"30","id":"2.4","text":"2.4 关系代数","key":"2.4","parentnodeid":"2","isparentflag":1,"level":2,"ancestor":"2#","children":[{"_sysrowno":"31","id":"2.4.1","text":"2.4.1 集合运算","key":"2.4.1","parentnodeid":"2.4","isparentflag":0,"level":3,"ancestor":"2#2.4#"},{"_sysrowno":"32","id":"2.4.2","text":"2.4.2 专门的关系运算","key":"2.4.2","parentnodeid":"2.4","isparentflag":0,"level":3,"ancestor":"2#2.4#"}],"_childno":3},{"_sysrowno":"31","id":"2.4.1","text":"2.4.1 集合运算","key":"2.4.1","parentnodeid":"2.4","isparentflag":0,"level":3,"ancestor":"2#2.4#"},{"_sysrowno":"32","id":"2.4.2","text":"2.4.2 专门的关系运算","key":"2.4.2","parentnodeid":"2.4","isparentflag":0,"level":3,"ancestor":"2#2.4#"},{"_sysrowno":"33","id":"2.5","text":"2.5 查询优化","key":"2.5","parentnodeid":"2","isparentflag":1,"level":2,"ancestor":"2#","children":[{"_sysrowno":"34","id":"2.5.1","text":"2.5.1 查询优化概述","key":"2.5.1","parentnodeid":"2.5","isparentflag":0,"level":3,"ancestor":"2#2.5#"},{"_sysrowno":"35","id":"2.5.2","text":"2.5.2 查询优化的一般准则","key":"2.5.2","parentnodeid":"2.5","isparentflag":0,"level":3,"ancestor":"2#2.5#"},{"_sysrowno":"36","id":"2.5.3","text":"2.5.3 关系代数等价变换规则","key":"2.5.3","parentnodeid":"2.5","isparentflag":0,"level":3,"ancestor":"2#2.5#"}],"_childno":4},{"_sysrowno":"34","id":"2.5.1","text":"2.5.1 查询优化概述","key":"2.5.1","parentnodeid":"2.5","isparentflag":0,"level":3,"ancestor":"2#2.5#"},{"_sysrowno":"35","id":"2.5.2","text":"2.5.2 查询优化的一般准则","key":"2.5.2","parentnodeid":"2.5","isparentflag":0,"level":3,"ancestor":"2#2.5#"},{"_sysrowno":"36","id":"2.5.3","text":"2.5.3 关系代数等价变换规则","key":"2.5.3","parentnodeid":"2.5","isparentflag":0,"level":3,"ancestor":"2#2.5#"},{"_sysrowno":"37","id":"2.6","text":"2.x 习题","key":"2.6","parentnodeid":"2","isparentflag":0,"level":2,"ancestor":"2#"}]';
set @data='[{"id":"1","text":"第1章 数据库系统基础","parentnodeid":"","isparentflag":1,"level":1,"ancestor":""},{"id":"1.1","text":"1.1 数据库简介","parentnodeid":"1","isparentflag":1,"level":2,"ancestor":"1#"},{"id":"1.1.1","text":"1.1.1 数据库基本概念","parentnodeid":"1.1","isparentflag":0,"level":3,"ancestor":"1#1.1#"},{"id":"1.1.2","text":"1.1.2 数据库技术的产生和发展","parentnodeid":"1.1","isparentflag":0,"level":3,"ancestor":"1#1.1#"},{"id":"1.2","text":"1.2 数据模型与概念模型","parentnodeid":"1","isparentflag":1,"level":2,"ancestor":"1#"},{"id":"1.2.1","text":"1.2.1 概念模型","parentnodeid":"1.2","isparentflag":0,"level":3,"ancestor":"1#1.2#"},{"id":"1.2.2","text":"1.2.2 数据模型","parentnodeid":"1.2","isparentflag":0,"level":3,"ancestor":"1#1.2#"},{"id":"1.2.3","text":"1.2.3 关系模型的优缺点","parentnodeid":"1.2","isparentflag":0,"level":3,"ancestor":"1#1.2#"},{"id":"1.3","text":"1.3 数据库管理系统","parentnodeid":"1","isparentflag":1,"level":2,"ancestor":"1#"},{"id":"1.3.1","text":"1.3.1 数据库管理系统的功能","parentnodeid":"1.3","isparentflag":0,"level":3,"ancestor":"1#1.3#"},{"id":"1.3.2","text":"1.3.2 数据库管理系统的组成","parentnodeid":"1.3","isparentflag":0,"level":3,"ancestor":"1#1.3#"},{"id":"1.3.3","text":"1.3.3 关系数据库管理系统实例","parentnodeid":"1.3","isparentflag":0,"level":3,"ancestor":"1#1.3#"},{"id":"1.4","text":"1.4 数据库应用系统的结构","parentnodeid":"1","isparentflag":1,"level":2,"ancestor":"1#"},{"id":"1.4.1","text":"1.4.1 数据库应用系统的组成","parentnodeid":"1.4","isparentflag":0,"level":3,"ancestor":"1#1.4#"},{"id":"1.4.2","text":"1.4.2 数据库应用系统的三级数据模式结构","parentnodeid":"1.4","isparentflag":0,"level":3,"ancestor":"1#1.4#"},{"id":"1.4.3","text":"1.4.3 数据库应用系统的体系结构","parentnodeid":"1.4","isparentflag":0,"level":3,"ancestor":"1#1.4#"},{"id":"1.4.4","text":"1.4.4 数据库的设计过程","parentnodeid":"1.4","isparentflag":0,"level":3,"ancestor":"1#1.4#"},{"id":"1.5","text":"1.5 数据库技术的研究与发展方向","parentnodeid":"1","isparentflag":1,"level":2,"ancestor":"1#"},{"id":"1.5.1","text":"1.5.1 传统数据库技术的局限性","parentnodeid":"1.5","isparentflag":0,"level":3,"ancestor":"1#1.5#"},{"id":"1.5.2","text":"1.5.2 第三代数据库系统","parentnodeid":"1.5","isparentflag":0,"level":3,"ancestor":"1#1.5#"},{"id":"1.5.3","text":"1.5.3 数据库技术与其他相关技术的结合","parentnodeid":"1.5","isparentflag":0,"level":3,"ancestor":"1#1.5#"},{"id":"1.6","text":"1.x 习题","parentnodeid":"1","isparentflag":0,"level":2,"ancestor":"1#"},{"id":"2","text":"第2章 关系数据库","parentnodeid":"","isparentflag":1,"level":1,"ancestor":""},{"id":"2.1","text":"2.1 关系数据结构","parentnodeid":"2","isparentflag":1,"level":2,"ancestor":"2#"},{"id":"2.1.1","text":"2.1.1 关系","parentnodeid":"2.1","isparentflag":0,"level":3,"ancestor":"2#2.1#"},{"id":"2.1.2","text":"2.1.2 关系模式","parentnodeid":"2.1","isparentflag":0,"level":3,"ancestor":"2#2.1#"},{"id":"2.1.3","text":"2.1.3 关系数据库","parentnodeid":"2.1","isparentflag":0,"level":3,"ancestor":"2#2.1#"},{"id":"2.2","text":"2.2 关系操作概述","parentnodeid":"2","isparentflag":0,"level":2,"ancestor":"2#"},{"id":"2.3","text":"2.3 关系的完整性","parentnodeid":"2","isparentflag":0,"level":2,"ancestor":"2#"},{"id":"2.4","text":"2.4 关系代数","parentnodeid":"2","isparentflag":1,"level":2,"ancestor":"2#"},{"id":"2.4.1","text":"2.4.1 集合运算","parentnodeid":"2.4","isparentflag":0,"level":3,"ancestor":"2#2.4#"},{"id":"2.4.2","text":"2.4.2 专门的关系运算","parentnodeid":"2.4","isparentflag":0,"level":3,"ancestor":"2#2.4#"},{"id":"2.5","text":"2.5 查询优化","parentnodeid":"2","isparentflag":1,"level":2,"ancestor":"2#"},{"id":"2.5.1","text":"2.5.1 查询优化概述","parentnodeid":"2.5","isparentflag":0,"level":3,"ancestor":"2#2.5#"},{"id":"2.5.2","text":"2.5.2 查询优化的一般准则","parentnodeid":"2.5","isparentflag":0,"level":3,"ancestor":"2#2.5#"},{"id":"2.5.3","text":"2.5.3 关系代数等价变换规则","parentnodeid":"2.5","isparentflag":0,"level":3,"ancestor":"2#2.5#"},{"id":"2.6","text":"2.x 习题","parentnodeid":"2","isparentflag":0,"level":2,"ancestor":"2#"},{"id":"3","text":"第3章 关系数据库设计理论与方法","parentnodeid":"","isparentflag":1,"level":1,"ancestor":""},{"id":"3.1","text":"3.1 数据库概念结构设计","parentnodeid":"3","isparentflag":1,"level":2,"ancestor":"3#"},{"id":"3.1.1","text":"3.1.1 概念结构的设计方法","parentnodeid":"3.1","isparentflag":0,"level":3,"ancestor":"3#3.1#"},{"id":"3.1.2","text":"3.1.2 数据抽象与局部视图设计","parentnodeid":"3.1","isparentflag":0,"level":3,"ancestor":"3#3.1#"},{"id":"3.1.3","text":"3.1.3 视图的集成","parentnodeid":"3.1","isparentflag":0,"level":3,"ancestor":"3#3.1#"},{"id":"3.2","text":"3.2 数据库逻辑结构设计","parentnodeid":"3","isparentflag":1,"level":2,"ancestor":"3#"},{"id":"3.2.1","text":"3.2.1 逻辑结构设计的任务和步骤","parentnodeid":"3.2","isparentflag":0,"level":3,"ancestor":"3#3.2#"},{"id":"3.2.2","text":"3.2.2 E-R图向关系模型的转换","parentnodeid":"3.2","isparentflag":0,"level":3,"ancestor":"3#3.2#"},{"id":"3.2.3","text":"3.2.3 用户子模式的设计","parentnodeid":"3.2","isparentflag":0,"level":3,"ancestor":"3#3.2#"},{"id":"3.3","text":"3.3 数据依赖","parentnodeid":"3","isparentflag":1,"level":2,"ancestor":"3#"},{"id":"3.3.1","text":"3.3.1 关系模式中的数据依赖","parentnodeid":"3.3","isparentflag":0,"level":3,"ancestor":"3#3.3#"},{"id":"3.3.2","text":"3.3.2 数据依赖对关系模式的影响","parentnodeid":"3.3","isparentflag":0,"level":3,"ancestor":"3#3.3#"},{"id":"3.3.3","text":"3.3.3 函数依赖","parentnodeid":"3.3","isparentflag":0,"level":3,"ancestor":"3#3.3#"},{"id":"3.4","text":"3.4 范  式","parentnodeid":"3","isparentflag":1,"level":2,"ancestor":"3#"},{"id":"3.4.1","text":"3.4.1 第一范式（1NF）","parentnodeid":"3.4","isparentflag":0,"level":3,"ancestor":"3#3.4#"},{"id":"3.4.2","text":"3.4.2 第二范式（2NF）","parentnodeid":"3.4","isparentflag":0,"level":3,"ancestor":"3#3.4#"},{"id":"3.4.3","text":"3.4.3 第三范式（3NF）","parentnodeid":"3.4","isparentflag":0,"level":3,"ancestor":"3#3.4#"},{"id":"3.4.4","text":"3.4.4 BC范式（BCNF）","parentnodeid":"3.4","isparentflag":0,"level":3,"ancestor":"3#3.4#"},{"id":"3.4.5","text":"3.4.5 多值依赖与第四范式（4NF）","parentnodeid":"3.4","isparentflag":0,"level":3,"ancestor":"3#3.4#"},{"id":"3.4.6","text":"3.4.6 连接依赖与第五范式（5NF）","parentnodeid":"3.4","isparentflag":0,"level":3,"ancestor":"3#3.4#"},{"id":"3.5","text":"3.5 函数依赖公理与模式分解","parentnodeid":"3","isparentflag":1,"level":2,"ancestor":"3#"},{"id":"3.5.1","text":"3.5.1 函数依赖公理","parentnodeid":"3.5","isparentflag":0,"level":3,"ancestor":"3#3.5#"},{"id":"3.5.2","text":"3.5.2 最小函数依赖集","parentnodeid":"3.5","isparentflag":0,"level":3,"ancestor":"3#3.5#"},{"id":"3.5.3","text":"3.5.3 快速求码方法","parentnodeid":"3.5","isparentflag":0,"level":3,"ancestor":"3#3.5#"},{"id":"3.5.4","text":"3.5.4 分解的无损连接性和保持函数依赖","parentnodeid":"3.5","isparentflag":0,"level":3,"ancestor":"3#3.5#"},{"id":"3.5.5","text":"3.5.5 模式分解的算法","parentnodeid":"3.5","isparentflag":0,"level":3,"ancestor":"3#3.5#"},{"id":"3.6","text":"3.x 习题","parentnodeid":"3","isparentflag":0,"level":2,"ancestor":"3#"},{"id":"4","text":"第4章 关系数据库设计实例","parentnodeid":"","isparentflag":1,"level":1,"ancestor":""},{"id":"4.1","text":"4.1 使用E-R图设计数据库","parentnodeid":"4","isparentflag":1,"level":2,"ancestor":"4#"},{"id":"4.1.1","text":"4.1.1 概念模型设计","parentnodeid":"4.1","isparentflag":0,"level":3,"ancestor":"4#4.1#"},{"id":"4.1.2","text":"4.1.2 逻辑模型设计","parentnodeid":"4.1","isparentflag":0,"level":3,"ancestor":"4#4.1#"},{"id":"4.2","text":"4.2 使用范式化理论设计数据库","parentnodeid":"4","isparentflag":0,"level":2,"ancestor":"4#"},{"id":"4.3","text":"4.3 数据库表的设计","parentnodeid":"4","isparentflag":0,"level":2,"ancestor":"4#"},{"id":"4.4","text":"4.4 数据库的创建","parentnodeid":"4","isparentflag":0,"level":2,"ancestor":"4#"},{"id":"4.5","text":"4.5 习题","parentnodeid":"4","isparentflag":0,"level":2,"ancestor":"4#"},{"id":"5","text":"第5章 数据库与表的管理","parentnodeid":"","isparentflag":1,"level":1,"ancestor":""},{"id":"5.1","text":"5.1 数据库的创建与维护","parentnodeid":"5","isparentflag":1,"level":2,"ancestor":"5#"},{"id":"5.1.1","text":"5.1.1 SQL Server数据库","parentnodeid":"5.1","isparentflag":0,"level":3,"ancestor":"5#5.1#"},{"id":"5.1.2","text":"5.1.2 创建数据库","parentnodeid":"5.1","isparentflag":0,"level":3,"ancestor":"5#5.1#"},{"id":"5.1.3","text":"5.1.3 维护数据库","parentnodeid":"5.1","isparentflag":0,"level":3,"ancestor":"5#5.1#"},{"id":"5.1.4","text":"5.1.4 数据库备份与恢复","parentnodeid":"5.1","isparentflag":0,"level":3,"ancestor":"5#5.1#"},{"id":"5.2","text":"5.2 表的创建与维护","parentnodeid":"5","isparentflag":1,"level":2,"ancestor":"5#"},{"id":"5.2.1","text":"5.2.1 表概述","parentnodeid":"5.2","isparentflag":0,"level":3,"ancestor":"5#5.2#"},{"id":"5.2.2","text":"5.2.2 数据类型","parentnodeid":"5.2","isparentflag":0,"level":3,"ancestor":"5#5.2#"},{"id":"5.2.3","text":"5.2.3 创建表","parentnodeid":"5.2","isparentflag":0,"level":3,"ancestor":"5#5.2#"},{"id":"5.2.4","text":"5.2.4 修改表","parentnodeid":"5.2","isparentflag":0,"level":3,"ancestor":"5#5.2#"},{"id":"5.2.5","text":"5.2.5 删除表","parentnodeid":"5.2","isparentflag":0,"level":3,"ancestor":"5#5.2#"},{"id":"5.3","text":"5.3 数据完整性约束","parentnodeid":"5","isparentflag":1,"level":2,"ancestor":"5#"},{"id":"5.3.1","text":"5.3.1 PRIMARY KEY主键约束","parentnodeid":"5.3","isparentflag":0,"level":3,"ancestor":"5#5.3#"},{"id":"5.3.2","text":"5.3.2 FOREIGN KEY外键约束","parentnodeid":"5.3","isparentflag":0,"level":3,"ancestor":"5#5.3#"},{"id":"5.3.3","text":"5.3.3 UNIQUE约束","parentnodeid":"5.3","isparentflag":0,"level":3,"ancestor":"5#5.3#"},{"id":"5.3.4","text":"5.3.4 CHECK约束","parentnodeid":"5.3","isparentflag":0,"level":3,"ancestor":"5#5.3#"},{"id":"5.3.5","text":"5.3.5 DEFAULT缺省约束","parentnodeid":"5.3","isparentflag":0,"level":3,"ancestor":"5#5.3#"},{"id":"5.3.6","text":"5.3.6 NOT NULL非空约束","parentnodeid":"5.3","isparentflag":0,"level":3,"ancestor":"5#5.3#"},{"id":"5.4","text":"5.4 表数据的更新","parentnodeid":"5","isparentflag":1,"level":2,"ancestor":"5#"},{"id":"5.4.1","text":"5.4.1 插入数据","parentnodeid":"5.4","isparentflag":0,"level":3,"ancestor":"5#5.4#"},{"id":"5.4.2","text":"5.4.2 修改数据","parentnodeid":"5.4","isparentflag":0,"level":3,"ancestor":"5#5.4#"},{"id":"5.4.3","text":"5.4.3 删除数据","parentnodeid":"5.4","isparentflag":0,"level":3,"ancestor":"5#5.4#"},{"id":"5.5","text":"5.5 临时表和表变量","parentnodeid":"5","isparentflag":0,"level":2,"ancestor":"5#"},{"id":"5.6","text":"5.6 索  引","parentnodeid":"5","isparentflag":1,"level":2,"ancestor":"5#"},{"id":"5.6.1","text":"5.6.1 索引概述","parentnodeid":"5.6","isparentflag":0,"level":3,"ancestor":"5#5.6#"},{"id":"5.6.2","text":"5.6.2 创建索引","parentnodeid":"5.6","isparentflag":0,"level":3,"ancestor":"5#5.6#"},{"id":"5.6.3","text":"5.6.3 删除索引","parentnodeid":"5.6","isparentflag":0,"level":3,"ancestor":"5#5.6#"},{"id":"5.7","text":"5.x 习题","parentnodeid":"5","isparentflag":0,"level":2,"ancestor":"5#"},{"id":"6","text":"第6章 数据检索","parentnodeid":"","isparentflag":1,"level":1,"ancestor":""},{"id":"6.1","text":"6.1 简单查询","parentnodeid":"6","isparentflag":1,"level":2,"ancestor":"6#"},{"id":"6.1.1","text":"6.1.1 使用星号（*）检索所有列","parentnodeid":"6.1","isparentflag":0,"level":3,"ancestor":"6#6.1#"},{"id":"6.1.2","text":"6.1.2 使用别名","parentnodeid":"6.1","isparentflag":0,"level":3,"ancestor":"6#6.1#"},{"id":"6.1.3","text":"6.1.3 DISTINCT选项","parentnodeid":"6.1","isparentflag":0,"level":3,"ancestor":"6#6.1#"},{"id":"6.1.4","text":"6.1.4 SELECT列表中使用表达式","parentnodeid":"6.1","isparentflag":0,"level":3,"ancestor":"6#6.1#"},{"id":"6.1.5","text":"6.1.5 ORDER BY排序子句","parentnodeid":"6.1","isparentflag":0,"level":3,"ancestor":"6#6.1#"},{"id":"6.1.6","text":"6.1.6 TOP和PERCENT子句","parentnodeid":"6.1","isparentflag":0,"level":3,"ancestor":"6#6.1#"},{"id":"6.1.7","text":"6.1.7 SELECT…INTO复制数据","parentnodeid":"6.1","isparentflag":0,"level":3,"ancestor":"6#6.1#"},{"id":"6.2","text":"6.2 条件查询","parentnodeid":"6","isparentflag":1,"level":2,"ancestor":"6#"},{"id":"6.2.1","text":"6.2.1 组合搜索条件","parentnodeid":"6.2","isparentflag":0,"level":3,"ancestor":"6#6.2#"},{"id":"6.2.2","text":"6.2.2 通配符及[NOT] LIKE操作符","parentnodeid":"6.2","isparentflag":0,"level":3,"ancestor":"6#6.2#"},{"id":"6.2.3","text":"6.2.3 [NOT] IN操作符","parentnodeid":"6.2","isparentflag":0,"level":3,"ancestor":"6#6.2#"},{"id":"6.3","text":"6.3 使用函数检索数据","parentnodeid":"6","isparentflag":1,"level":2,"ancestor":"6#"},{"id":"6.3.1","text":"6.3.1 字符串处理函数","parentnodeid":"6.3","isparentflag":0,"level":3,"ancestor":"6#6.3#"},{"id":"6.3.2","text":"6.3.2 日期时间函数","parentnodeid":"6.3","isparentflag":0,"level":3,"ancestor":"6#6.3#"},{"id":"6.3.3","text":"6.3.3 聚合函数","parentnodeid":"6.3","isparentflag":0,"level":3,"ancestor":"6#6.3#"},{"id":"6.3.4","text":"6.3.4 排名函数","parentnodeid":"6.3","isparentflag":0,"level":3,"ancestor":"6#6.3#"},{"id":"6.3.5","text":"6.3.5 其他函数","parentnodeid":"6.3","isparentflag":0,"level":3,"ancestor":"6#6.3#"},{"id":"6.4","text":"6.4 数据分组检索","parentnodeid":"6","isparentflag":1,"level":2,"ancestor":"6#"},{"id":"6.4.1","text":"6.4.1 GROUP BY子句","parentnodeid":"6.4","isparentflag":0,"level":3,"ancestor":"6#6.4#"},{"id":"6.4.2","text":"6.4.2 使用HAVING子句过滤分组结果","parentnodeid":"6.4","isparentflag":0,"level":3,"ancestor":"6#6.4#"},{"id":"6.4.3","text":"6.4.3 使用ROLLUP、CUBE和GROUPING SETS运算符","parentnodeid":"6.4","isparentflag":0,"level":3,"ancestor":"6#6.4#"},{"id":"6.5","text":"6.5 使用JOIN连接表","parentnodeid":"6","isparentflag":1,"level":2,"ancestor":"6#"},{"id":"6.5.1","text":"6.5.1 内连接与交叉连接","parentnodeid":"6.5","isparentflag":0,"level":3,"ancestor":"6#6.5#"},{"id":"6.5.2","text":"6.5.2 外连接OUTER JOIN","parentnodeid":"6.5","isparentflag":0,"level":3,"ancestor":"6#6.5#"},{"id":"6.5.3","text":"6.5.3 自连接（SELF-JOIN）","parentnodeid":"6.5","isparentflag":0,"level":3,"ancestor":"6#6.5#"},{"id":"6.5.4","text":"6.5.4 使用带聚合函数的多表连接","parentnodeid":"6.5","isparentflag":0,"level":3,"ancestor":"6#6.5#"},{"id":"6.6","text":"6.6 子查询","parentnodeid":"6","isparentflag":1,"level":2,"ancestor":"6#"},{"id":"6.6.1","text":"6.6.1 使用单值子查询","parentnodeid":"6.6","isparentflag":0,"level":3,"ancestor":"6#6.6#"},{"id":"6.6.2","text":"6.6.2 使用IN（NOT IN）的子查询","parentnodeid":"6.6","isparentflag":0,"level":3,"ancestor":"6#6.6#"},{"id":"6.6.3","text":"6.6.3 使用ANY和ALL操作符的嵌套查询","parentnodeid":"6.6","isparentflag":0,"level":3,"ancestor":"6#6.6#"},{"id":"6.6.4","text":"6.6.4 [NOT] EXISTS","parentnodeid":"6.6","isparentflag":0,"level":3,"ancestor":"6#6.6#"},{"id":"6.6.5","text":"6.6.5 使用衍生表","parentnodeid":"6.6","isparentflag":0,"level":3,"ancestor":"6#6.6#"},{"id":"6.6.6","text":"6.6.6 使用公用表表达式","parentnodeid":"6.6","isparentflag":0,"level":3,"ancestor":"6#6.6#"},{"id":"6.6.7","text":"6.6.7 相关子查询","parentnodeid":"6.6","isparentflag":0,"level":3,"ancestor":"6#6.6#"},{"id":"6.6.8","text":"6.6.8 在UPDATE、DELETE、INSERT中使用子查询","parentnodeid":"6.6","isparentflag":0,"level":3,"ancestor":"6#6.6#"},{"id":"6.7","text":"6.7 使用CASE语句处理条件数据","parentnodeid":"6","isparentflag":0,"level":2,"ancestor":"6#"},{"id":"6.8","text":"6.8 组合查询","parentnodeid":"6","isparentflag":0,"level":2,"ancestor":"6#"},{"id":"6.9","text":"6.9 习题","parentnodeid":"6","isparentflag":0,"level":2,"ancestor":"6#"},{"id":"7","text":"第7章 T-SQL程序设计","parentnodeid":"","isparentflag":1,"level":1,"ancestor":""},{"id":"7.1","text":"7.1 T-SQL程序设计基础","parentnodeid":"7","isparentflag":1,"level":2,"ancestor":"7#"},{"id":"7.1.1","text":"7.1.1 变量定义","parentnodeid":"7.1","isparentflag":0,"level":3,"ancestor":"7#7.1#"},{"id":"7.1.2","text":"7.1.2 PRINT输出语句","parentnodeid":"7.1","isparentflag":0,"level":3,"ancestor":"7#7.1#"},{"id":"7.1.3","text":"7.1.3 块语句BEGIN...END","parentnodeid":"7.1","isparentflag":0,"level":3,"ancestor":"7#7.1#"},{"id":"7.1.4","text":"7.1.4 条件处理IF...ELSE","parentnodeid":"7.1","isparentflag":0,"level":3,"ancestor":"7#7.1#"},{"id":"7.1.5","text":"7.1.5 循环处理","parentnodeid":"7.1","isparentflag":0,"level":3,"ancestor":"7#7.1#"},{"id":"7.2","text":"7.2 视  图","parentnodeid":"7","isparentflag":1,"level":2,"ancestor":"7#"},{"id":"7.2.1","text":"7.2.1 视图概述","parentnodeid":"7.2","isparentflag":0,"level":3,"ancestor":"7#7.2#"},{"id":"7.2.2","text":"7.2.2 创建视图","parentnodeid":"7.2","isparentflag":0,"level":3,"ancestor":"7#7.2#"},{"id":"7.2.3","text":"7.2.3 通过视图修改数据","parentnodeid":"7.2","isparentflag":0,"level":3,"ancestor":"7#7.2#"},{"id":"7.2.4","text":"7.2.4 删除视图","parentnodeid":"7.2","isparentflag":0,"level":3,"ancestor":"7#7.2#"},{"id":"7.3","text":"7.3 存储过程","parentnodeid":"7","isparentflag":1,"level":2,"ancestor":"7#"},{"id":"7.3.1","text":"7.3.1 存储过程概述","parentnodeid":"7.3","isparentflag":0,"level":3,"ancestor":"7#7.3#"},{"id":"7.3.2","text":"7.3.2 创建存储过程","parentnodeid":"7.3","isparentflag":0,"level":3,"ancestor":"7#7.3#"},{"id":"7.3.3","text":"7.3.3 存储过程与动态SQL语句","parentnodeid":"7.3","isparentflag":0,"level":3,"ancestor":"7#7.3#"},{"id":"7.4","text":"7.4 用户定义函数","parentnodeid":"7","isparentflag":1,"level":2,"ancestor":"7#"},{"id":"7.4.1","text":"7.4.1 标量函数","parentnodeid":"7.4","isparentflag":0,"level":3,"ancestor":"7#7.4#"},{"id":"7.4.2","text":"7.4.2 表值函数","parentnodeid":"7.4","isparentflag":0,"level":3,"ancestor":"7#7.4#"},{"id":"7.4.3","text":"7.4.3 存储过程与用户定义函数的比较","parentnodeid":"7.4","isparentflag":0,"level":3,"ancestor":"7#7.4#"},{"id":"7.5","text":"7.5 触发器","parentnodeid":"7","isparentflag":1,"level":2,"ancestor":"7#"},{"id":"7.5.1","text":"7.5.1 触发器概述","parentnodeid":"7.5","isparentflag":0,"level":3,"ancestor":"7#7.5#"},{"id":"7.5.2","text":"7.5.2 创建触发器","parentnodeid":"7.5","isparentflag":0,"level":3,"ancestor":"7#7.5#"},{"id":"7.6","text":"7.6 游  标","parentnodeid":"7","isparentflag":1,"level":2,"ancestor":"7#"},{"id":"7.6.1","text":"7.6.1 游标概述","parentnodeid":"7.6","isparentflag":0,"level":3,"ancestor":"7#7.6#"},{"id":"7.6.2","text":"7.6.2 定义游标","parentnodeid":"7.6","isparentflag":0,"level":3,"ancestor":"7#7.6#"},{"id":"7.6.3","text":"7.6.3 FETCH读取游标数据","parentnodeid":"7.6","isparentflag":0,"level":3,"ancestor":"7#7.6#"},{"id":"7.6.4","text":"7.6.4 游标循环","parentnodeid":"7.6","isparentflag":0,"level":3,"ancestor":"7#7.6#"},{"id":"7.6.5","text":"7.6.5 WHERE CURRENT OF的应用","parentnodeid":"7.6","isparentflag":0,"level":3,"ancestor":"7#7.6#"},{"id":"7.6.6","text":"7.6.6 游标的综合应用","parentnodeid":"7.6","isparentflag":0,"level":3,"ancestor":"7#7.6#"},{"id":"7.7","text":"7.x 习题","parentnodeid":"7","isparentflag":0,"level":2,"ancestor":"7#"},{"id":"8","text":"第8章 SQL SERVER数据安全管理","parentnodeid":"","isparentflag":1,"level":1,"ancestor":""},{"id":"8.1","text":"8.1 用户管理","parentnodeid":"8","isparentflag":1,"level":2,"ancestor":"8#"},{"id":"8.1.1","text":"8.1.1 SQL Server登录用户管理","parentnodeid":"8.1","isparentflag":0,"level":3,"ancestor":"8#8.1#"},{"id":"8.1.2","text":"8.1.2 数据库用户管理","parentnodeid":"8.1","isparentflag":0,"level":3,"ancestor":"8#8.1#"},{"id":"8.2","text":"8.2 角色管理","parentnodeid":"8","isparentflag":1,"level":2,"ancestor":"8#"},{"id":"8.2.1","text":"8.2.1 固定服务器角色","parentnodeid":"8.2","isparentflag":0,"level":3,"ancestor":"8#8.2#"},{"id":"8.2.2","text":"8.2.2 数据库角色","parentnodeid":"8.2","isparentflag":0,"level":3,"ancestor":"8#8.2#"},{"id":"8.3","text":"8.3 权限管理","parentnodeid":"8","isparentflag":1,"level":2,"ancestor":"8#"},{"id":"8.3.1","text":"8.3.1 权限管理概述","parentnodeid":"8.3","isparentflag":0,"level":3,"ancestor":"8#8.3#"},{"id":"8.3.2","text":"8.3.2 授予权限","parentnodeid":"8.3","isparentflag":0,"level":3,"ancestor":"8#8.3#"},{"id":"8.3.3","text":"8.3.3 查看权限","parentnodeid":"8.3","isparentflag":0,"level":3,"ancestor":"8#8.3#"},{"id":"8.3.4","text":"8.3.4 拒绝权限","parentnodeid":"8.3","isparentflag":0,"level":3,"ancestor":"8#8.3#"},{"id":"8.3.5","text":"8.3.5 取消权限","parentnodeid":"8.3","isparentflag":0,"level":3,"ancestor":"8#8.3#"},{"id":"8.4","text":"8.4 事务控制与并发处理","parentnodeid":"8","isparentflag":1,"level":2,"ancestor":"8#"},{"id":"8.4.1","text":"8.4.1 事务概述","parentnodeid":"8.4","isparentflag":0,"level":3,"ancestor":"8#8.4#"},{"id":"8.4.2","text":"8.4.2 事务的并发控制","parentnodeid":"8.4","isparentflag":0,"level":3,"ancestor":"8#8.4#"},{"id":"8.4.3","text":"8.4.3 锁的概念与分类","parentnodeid":"8.4","isparentflag":0,"level":3,"ancestor":"8#8.4#"},{"id":"8.4.4","text":"8.4.4 SQL Server的并发控制机制","parentnodeid":"8.4","isparentflag":0,"level":3,"ancestor":"8#8.4#"},{"id":"8.4.5","text":"8.4.5 SQL Server事务编程","parentnodeid":"8.4","isparentflag":0,"level":3,"ancestor":"8#8.4#"},{"id":"8.5","text":"8.x 习题","parentnodeid":"8","isparentflag":0,"level":2,"ancestor":"8#"},{"id":"9","text":"第9章 SQL SERVER高级技术及查询优化","parentnodeid":"","isparentflag":1,"level":1,"ancestor":""},{"id":"9.1","text":"9.1 数据导入与导出","parentnodeid":"9","isparentflag":1,"level":2,"ancestor":"9#"},{"id":"9.1.1","text":"9.1.1 SQL Server数据导出","parentnodeid":"9.1","isparentflag":0,"level":3,"ancestor":"9#9.1#"},{"id":"9.1.2","text":"9.1.2 SQL Server数据导入","parentnodeid":"9.1","isparentflag":0,"level":3,"ancestor":"9#9.1#"},{"id":"9.2","text":"9.2 SQL Server系统表与系统函数的应用","parentnodeid":"9","isparentflag":1,"level":2,"ancestor":"9#"},{"id":"9.2.1","text":"9.2.1 系统表的应用","parentnodeid":"9.2","isparentflag":0,"level":3,"ancestor":"9#9.2#"},{"id":"9.2.2","text":"9.2.2 COLUMNPROPERTY函数及其应用","parentnodeid":"9.2","isparentflag":0,"level":3,"ancestor":"9#9.2#"},{"id":"9.2.3","text":"9.2.3 BINARY_CHECKSUM和CHECKSUM_AGG函数的应用","parentnodeid":"9.2","isparentflag":0,"level":3,"ancestor":"9#9.2#"},{"id":"9.3","text":"9.3 SQL Server数组模拟","parentnodeid":"9","isparentflag":0,"level":2,"ancestor":"9#"},{"id":"9.4","text":"9.4 SQL Server中树状结构的实现技术","parentnodeid":"9","isparentflag":1,"level":2,"ancestor":"9#"},{"id":"9.4.1","text":"9.4.1 树状结构的关系表存储结构","parentnodeid":"9.4","isparentflag":0,"level":3,"ancestor":"9#9.4#"},{"id":"9.4.2","text":"9.4.2 插入节点","parentnodeid":"9.4","isparentflag":0,"level":3,"ancestor":"9#9.4#"},{"id":"9.4.3","text":"9.4.3 查询节点","parentnodeid":"9.4","isparentflag":0,"level":3,"ancestor":"9#9.4#"},{"id":"9.4.4","text":"9.4.4 删除节点","parentnodeid":"9.4","isparentflag":0,"level":3,"ancestor":"9#9.4#"},{"id":"9.5","text":"9.5 SQL Server查询优化","parentnodeid":"9","isparentflag":0,"level":2,"ancestor":"9#"},{"id":"9.6","text":"9.x 习题","parentnodeid":"9","isparentflag":0,"level":2,"ancestor":"9#"},{"id":"10","text":"第10章 数据库在MIS开发中的应用","parentnodeid":"","isparentflag":1,"level":1,"ancestor":""},{"id":"10.1","text":"10.1 常用MIS用户定义函数","parentnodeid":"10","isparentflag":0,"level":2,"ancestor":"10#"},{"id":"10.2","text":"10.2 会计核算系统中常用数据处理技术","parentnodeid":"10","isparentflag":1,"level":2,"ancestor":"10#"},{"id":"10.2.1","text":"10.2.1 科目发生额逐级汇总","parentnodeid":"10.2","isparentflag":0,"level":3,"ancestor":"10#10.2#"},{"id":"10.2.2","text":"10.2.2 明细账的生成及其余额的滚动计算","parentnodeid":"10.2","isparentflag":0,"level":3,"ancestor":"10#10.2#"},{"id":"10.2.3","text":"10.2.3 应收账款分析","parentnodeid":"10.2","isparentflag":0,"level":3,"ancestor":"10#10.2#"},{"id":"10.3","text":"10.3 销售营销系统中常用数据挖掘技术","parentnodeid":"10","isparentflag":1,"level":2,"ancestor":"10#"},{"id":"10.3.1","text":"10.3.1 盈利能力分析","parentnodeid":"10.3","isparentflag":0,"level":3,"ancestor":"10#10.3#"},{"id":"10.3.2","text":"10.3.2 订单交货准时率分析","parentnodeid":"10.3","isparentflag":0,"level":3,"ancestor":"10#10.3#"},{"id":"10.3.3","text":"10.3.3 销售趋势分析","parentnodeid":"10.3","isparentflag":0,"level":3,"ancestor":"10#10.3#"},{"id":"10.3.4","text":"10.3.4 销售绩效考核","parentnodeid":"10.3","isparentflag":0,"level":3,"ancestor":"10#10.3#"},{"id":"10.4","text":"10.x 习题","parentnodeid":"10","isparentflag":0,"level":2,"ancestor":"10#"}]';
#call demo1003b(@data);
#select * from contents;


drop procedure if exists demo1003c;
DELIMITER $$
create procedure demo1003c(	$data mediumtext, $flag int)
begin
	if ($flag=1) then
		truncate table contents;
    end if;
    insert into contents (contentid, contenttitle,parentnodeid,level,isparentflag, ancestor)
	SELECT * FROM JSON_TABLE($data, "$[*]" COLUMNS(
	contentid char(10) PATH "$.id", 
	contenttitle varchar(200) PATH "$.text", 
	parentnodeid varchar(200) PATH "$.parentnodeid", 
	level int PATH "$.level", 
	isparentflag int PATH "$.isparentflag", 
	ancestor varchar(200) PATH "$.ancestor"
    )
) as p;
end $$
DELIMITER ;

drop procedure if exists demo1101a;
DELIMITER $$
create procedure demo1101a( 
	$parentnodeid varchar(100)
)
begin
    if ($parentnodeid='') then     
      select '_root' as categoryid, '全部类别' as categoryname, '' as englishname, '' as parentnodeid, 0 as level,1 as isparentflag,'' as ancestor,
      '_root' as id, '_root' as 'key', '全部类别' as 'text';
	elseif ($parentnodeid='_root') then
      select categoryid,categoryname,englishname, parentnodeid,level,isparentflag,concat('_root#', trim(ancestor)) as ancestor,
      categoryid as id, categoryid as 'key', concat(categoryid,' ',categoryname) as 'text' from categorytree where parentnodeid='';
    else   
      select categoryid,categoryname,englishname, parentnodeid,level,isparentflag,concat('_root#', trim(ancestor)) as ancestor,
      categoryid as id, categoryid as 'key', concat(categoryid,' ',categoryname) as 'text' from categorytree where parentnodeid=$parentnodeid;
    end if;
end $$
DELIMITER ;

drop procedure if exists demo1101b;
delimiter $$
create procedure demo1101b(
	$pageno int,
    $pagesize int,
    $keyvalue varchar(255),
    $filter varchar(255),
    $categoryid varchar(100)
)
begin
	select trim(ancestor), isparentflag into @s1,@s2 from categorytree where categoryid=$categoryid;    
	if ($categoryid='' or $categoryid='_root') then 
    set @sql=concat("
      select a.*, c.companyname as suppliername, region,city,d.categoryname,
      a.productid as 'key' from products as a 
      join suppliers c using(supplierid)
      join categories d using(categoryid)
      order by a.productid");
   elseif (@s2=0) then
      set @sql=concat("select a.*, c.companyname as suppliername, region,city,d.categoryname,
      a.productid as 'key' from products as a 
      join suppliers c using(supplierid)
      join categorytree d on a.subcategoryid=d.categoryid
      where a.SubcategoryID='", $categoryid,"' order by a.productid");
   else    
      set @sql=concat("select a.*, c.companyname as suppliername, region,city,d.categoryname,
      a.productid as 'key' from products as a 
      join suppliers c using(supplierid)
      join categorytree d on a.subcategoryid=d.categoryid
      where ancestor like '", @s1, $categoryid,"#%' order by a.productid");
    end if;   
    #select @sql;
    call sys_gridPaging(@sql, $pageno, $pagesize,'productid',$keyvalue,'', $filter);
end $$
delimiter ;
#call demo1101b(1,10,'','','H');

drop procedure if exists demo1101c; 
delimiter $$
create procedure demo1101c(  ##树结构节点保存
	$data MediumText
)
begin
	call sys_runEditRow('products', 'productid', '', $data,  @row);  #row为主键列的值，json格式
    set @s=sys_GetJsonValue(@row, '_error', 'c');
    if (@s='' or @s is null) then   
		set @s=sys_GetJsonValue(@row, 'productid', 'n');  #提取主键值，n表示数值型数据
        select ancestor,categoryid into @s2,@s3 from categorytree where categoryid in (select subcategoryid from products where productid=@s);
        #select @s3,@s2,@s;
        select count(*)+1 as rowno, @s2 as ancestor, @s3 subcategoryid from products where subcategoryid=@s3 and productid<@s;
    end if ;
end $$
delimiter ;
set @data='[{"productid":"7","productname":"豆腐333","englishname":"Tofu","quantityperunit":"500g","unit":"盒","unitprice":4.25,"subcategoryid":"G3","categoryname":"农产品","supplierid":"YXDZP","releasedate":"2014-10-05","photopath":[{"filename":"mybase/products/7.jpg","name":"图片"}],"categoryid":"G","_action":"update","_reloadrow":1,"_treeflag":0},{"productid":"7","productname":"豆腐333","englishname":"Tofu","quantityperunit":"500g","unit":"盒","unitprice":4.25,"subcategoryid":["G"],"categoryname":"农产品","supplierid":"YXDZP","releasedate":"2014-10-04T16:00:00.000Z","photopath":[{"name":"图片","filename":"mybase/products/7.jpg","uid":"photopath_0","status":"done","url":"myServer//mybase/products/7.jpg"}],"categoryid":"G"}]';
set @data='[{"productid":"123","productname":"新希望原态牧场纯牛奶","englishname":"New Hope Virgin pasture pure milk","quantityperunit":"200ml*6盒","unit":"箱","unitprice":13.9,"subcategoryid":"D101","categoryname":"鲜奶","supplierid":"XXWTX","releasedate":"2014-12-23","photopath":[{"filename":"mybase/products/123.jpg","name":"图片"}],"categoryid":"D","_action":"update","_reloadrow":1,"_treeflag":0},{"productid":"123","productname":"新希望原态牧场纯牛奶","englishname":"New Hope Virgin pasture pure milk","quantityperunit":"200ml*6盒","unit":"箱","unitprice":13.9,"subcategoryid":["D","D1"],"categoryname":"鲜奶","supplierid":"XXWTX","releasedate":"2014-12-22T16:00:00.000Z","photopath":[{"filename":"mybase/products/123.jpg","uid":"photopath_0","name":"图片","status":"done","url":"myServer//mybase/products/123.jpg"}],"categoryid":"D"}]';
#call demo1101c(@data);


drop procedure if exists demo1101d; 
delimiter $$
create procedure demo1101d($productid int)  #查找一个商品的父节点及其在同类中的序号
begin
   select ancestor,categoryid into @s2,@s3 from categorytree where categoryid in (select subcategoryid from products where productid=@s);
   select count(*)+1 as rowno, @s2 as ancestor, @s3 subcategoryid from products where subcategoryid=@s3 and productid<@s;
end $$
delimiter ;

drop procedure if exists demo1102a;
delimiter $$
create procedure demo1102a($month int)
begin
	select distinct orderdate as id,orderdate as 'key', concat(month(orderdate),'月', day(orderdate),'日') as text, 
    '_root' as parentnodeid, 1 as level, 1 as isparentflag, '_root#' as ancestor from orders as a where year(orderdate)=2019 and month(orderdate)=$month
    union all
    select a.orderid as id, a.orderid as 'key', concat(a.orderid, ' ', a.customerid, ' ', b.companyname) as text,
    orderdate as parentnodeid, 2 as level, 0 as isparentflag, concat('_root#',orderdate,'#') as ancestor
    from orders as a
    join customers as b using(customerid) where year(orderdate)=2019 and month(orderdate)=$month
    order by concat(trim(ancestor),id);
end $$
delimiter ;
#call demo1102a(10);

drop procedure if exists demo1102d;
delimiter $$
create procedure demo1102d($orderid int)
begin
    select a.*, b.companyname as customername, d.companyname as shippername, employeename,
    e.productid, productname, Quantity,e.unitprice, e.discount, e.amount, f.QuantityPerunit,f.Unit
    from orders as a
    join customers as b using(customerid) 
    join employees as c using(employeeid)
    join shippers as d using(shipperid)
    join orderitems as e using(orderid)
    join products f using(productid)
    where orderid=$orderid
    order by productid;
end $$
delimiter ;


drop procedure if exists demo1102e;
delimiter $$
create procedure demo1102e($customerid varchar(100))
begin
    select count(*)+1 as rowno,(select count(*) from customers) as total from customers where customerid<$customerid;
end $$
delimiter ;

drop procedure if exists demo1102f; 
delimiter $$
create procedure demo1102f(
	$pageno int,
    $pagesize int,
    $filter varchar(255)
)
begin
	set @sql="select a.* from customers a order by customerid";
    call sys_gridPaging(@sql, $pageno, $pagesize, 'customerid','','customerid;companyname;contactname;address;phone', $filter);
end $$
delimiter ;
#call demo1102f(3,10,'');

drop procedure if exists demo1102g;
delimiter $$
create procedure demo1102g(
	$productid int
)
begin
	select productid,productname,unit,quantityperunit from products where productid=$productid;
end $$
delimiter ;

drop procedure if exists demo1102h;
delimiter $$
create procedure demo1102h(
	$action char(14),
	$orderid char(7),
    $oldproductid int,
    $productid int,
	$unitprice decimal(12,2),
    $quantity int,
    $discount decimal(3,2)
)
begin
	if($action='update') then
		update orderitems set productid=$productid,unitprice=$unitprice,quantity=$quantity,discount=$discount
		where orderid=$orderid and productid=$oldproductid;
	elseif($action='add') then
		insert into orderitems(orderid,productid,unitprice,quantity,discount)
		values($orderid,$productid,$unitprice,$quantity,$discount);
        select * from orderitems where orderid=$orderid and productid<=$productid;
	elseif($action='delete') then
		delete from orderitems where orderid=$orderid and productid=$productid;
	end if;
end $$
delimiter ;

drop procedure if exists demo1103b;
delimiter $$
create procedure demo1103b($productid int)
begin
    select count(*)+1 as rowno,(select count(*) from products) as total from products where ProductID<$ProductID;
end $$
delimiter ;

drop procedure if exists demo1103c;
delimiter $$
create procedure demo1103c($customerid varchar(10))
begin
    select count(*)+1 as rowno, (select count(*) from customers) as total from customers where customerID<$customerID;
end $$
delimiter ;


drop procedure if exists demo1201a; 
delimiter $$
create procedure demo1201a(
	$categoryid varchar(100),
	$date1 date,
	$date2 date
)
begin
	declare $s1,$s2 varchar(100);
    declare $x int;
    select categoryid, trim(ancestor),isparentflag into $s1,$s2,$x from categorytree where categoryid=$categoryid;
    select  $s1,$s2,$x;
    if ($s1 is null) then 
		select concat(year(orderdate),'-', right(100+month(orderdate),2)) as xmonth, sum(amount) as amt from orderitems a
		join orders b using(orderid)
		where productid=$categoryid and orderdate between $date1 and $date2
		group by concat(year(orderdate),'-', right(100+month(orderdate),2));
	elseif ($x=0) then
		select concat(year(orderdate),'-', right(100+month(orderdate),2)) as xmonth, sum(amount) as amt from orderitems a
		join orders b using(orderid)
		join products c using(productid)
		where subcategoryid=$categoryid and orderdate between $date1 and $date2
		group by concat(year(orderdate),'-', right(100+month(orderdate),2));
	else        
		select concat(year(orderdate),'-', right(100+month(orderdate),2)) as xmonth, sum(amount) as amt from orderitems a
		join orders b using(orderid)
		join products c using(productid)
		where orderdate between $date1 and $date2 and subcategoryID in (select categoryid from categorytree where trim(ancestor) like concat($s2, trim($s1),'#%'))
		group by concat(year(orderdate),'-', right(100+month(orderdate),2));       
	end if;    
end $$
delimiter ;
call demo1201a('A101', '2019-01-01', '2019-12-31');
call demo1201a('A1', '2019-01-01', '2019-12-31');
call demo1201a('10', '2019-01-01', '2019-12-31');


drop procedure if exists demo1201b; 
delimiter $$
create procedure demo1201a(
	$categoryid varchar(100),
	$date1 date,
	$date2 date
)
begin
	declare $s1,$s2 varchar(100);
    declare $x int;
    select categoryid, trim(ancestor),isparentflag into $s1,$s2,$x from categorytree where categoryid=$categoryid;
    select  $s1,$s2,$x;
    if ($s1 is null) then 
		select day(100+month(orderdate),2) as xday, sum(amount) as amt from orderitems a
		join orders b using(orderid)
		where productid=$categoryid and orderdate between $date1 and $date2
		group by day(100+month(orderdate),2);
	elseif ($x=0) then
		select day(100+month(orderdate),2) as xday ,sum(amount) as amt from orderitems a
		join orders b using(orderid)
		join products c using(productid)
		where subcategoryid=$categoryid and orderdate between $date1 and $date2
		group by day(100+month(orderdate),2);
	else        
		select  day(100+month(orderdate),2) as xday, sum(amount) as amt from orderitems a
		join orders b using(orderid)
		join products c using(productid)
		where orderdate between $date1 and $date2 and subcategoryID in (select categoryid from categorytree where trim(ancestor) like concat($s2, trim($s1),'#%'))
		group by day(100+month(orderdate),2);       
	end if;    
end $$
delimiter ;
call demo1201a('A101', '2019-01-01', '2019-12-31');
call demo1201a('A1', '2019-01-01', '2019-12-31');
call demo1201a('10', '2019-01-01', '2019-12-31');