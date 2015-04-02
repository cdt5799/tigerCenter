<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=US-ASCII"
    pageEncoding="US-ASCII"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Tiger Center</title>
    <meta http-equiv="X-UA-Compatible" content="IE=9" />
    <link rel="shortcut icon" href="images/icon.png" />
	<link rel="stylesheet" type="text/css" href="stylesheets/app.css" />
	<link rel="stylesheet" type="text/css" href="stylesheets/foundation.css" />
	<link rel="stylesheet" type="text/css" href="stylesheets/normalize.css" />

</head>
<body>

<div id="wrapper">
<div id="headWrap">
	<div id="head">
		<div id="headLeft">
			<image src="images/rit_logo_white.png" alt="RIT Logo"/><image src="images/rochester_it.png" alt="Rochester Institute of Technology Subtext"/>
		</div>
		<div id="headRight">
			<s:url action="login" var="loginLink"></s:url>
			
			<a href="http://www.rit.edu/directories" target="_blank">Directories</a> | 
			<a href="http://www.rit.edu/search" target="_blank">RIT Search</a> |
			<a href="http://www.rit.edu" target="_blank">RIT Home</a> | 
			<a href="${loginLink}">Log In</a>
		</div>
	</div>
</div>

<div id="mainWrap">
	<div id="logoutImage"style="text-align:center;">
		<image id="logoutImage" style="width:1024px;height:381px;" src="images/logout.png" />
	</div>
</div>
</div>

<div id="footWrap">
	<div id="foot">
		<s:text name="nav.copy" />
	</div>
</div>
</body>
</html>