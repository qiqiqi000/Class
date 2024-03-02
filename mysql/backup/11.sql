select * from  sys_pybase;
SELECT JSON_OBJECTAGG(chr, py) INTO OUTFILE 'd:\\myReact\\pinyin.json' FROM sys_pybase;

 MySQL server is running with the --secure-file-priv option so it cannot execute this statement	0.000 sec