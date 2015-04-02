<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="s" uri="/struts-tags" %>
<html lang="en" id="ng-app" ng-app="enrollApp">
<head>
    <meta charset="utf-8">
    <title>Tiger Center</title>
    <meta http-equiv="X-UA-Compatible" content="IE=9" />
    <meta name="viewport" content="width=device-width" />
    <link rel="shortcut icon" href="images/icon.png" />

	<link type="text/css" media="screen" rel="stylesheet" href="stylesheets/responsive-tables.css" />
	<link rel="stylesheet" type="text/css" href="stylesheets/app.css" />
	<link rel="stylesheet" type="text/css" href="stylesheets/foundation.css" />
	<link rel="stylesheet" type="text/css" href="stylesheets/normalize.css" />
	<link rel="stylesheet" type="text/css" href="stylesheets/progressbar.css" />
	<link rel="stylesheet" type="text/css" href="stylesheets/tooltip.css" />
	<link rel="stylesheet" type="text/css" href="js/lib/jquery/jquery-ui-1.10.4.min.css" />
	<link rel="stylesheet" type="text/css" href="js/lib/jquery/chosen.min.css" />
	<link rel="stylesheet" type="text/css" href="js/lib/jquery/jquery.contextMenu.css" />	

	<script src="<s:url value="js/lib/jquery/jquery-1.10.2.js"/>"> </script>
	<script src="<s:url value="js/lib/jquery/jquery-ui-1.10.4.js"/>"> </script>	
	<script src="<s:url value="js/lib/jquery/chosen.jquery.min.js"/>"> </script>
	<script src="<s:url value="js/lib/jquery/chosen.proto.min.js"/>"> </script>
	<script src="<s:url value="js/lib/jquery/jquery.contextMenu.js"/>"> </script>
	<script src="<s:url value="js/lib/jquery/jquery.ui.position.js"/>"> </script>
    
    <script src="<s:url value="js/foundation/vendor/jquery.js"/>"></script>
	<script src="<s:url value="js/foundation/vendor/fastclick.js"/>"></script>
	<script src="<s:url value="js/foundation/foundation.min.js"/>"></script>
	<script src="<s:url value="js/foundation/responsive-tables.js"/>"></script>
	<script src="js/foundation/foundation/foundation.joyride.js"></script>
  	<script src="js/foundation/vendor/jquery.cookie.js"></script>
    
    
    <script src="<s:url value="js/lib/json3.min.js" />"></script>
    <script src="<s:url value="js/lib/angular/angular.min.js" />"></script>
    <script src="<s:url value="js/lib/angular/angular-route.min.js" />"></script>
    <script src="<s:url value="js/lib/angular/angular-animate.min.js" />"></script>
    <script src="<s:url value="js/lib/angular/angular-sanitize.min.js" />"></script>
    <script src="<s:url value="js/lib/angular/angular-scrollable-table.js" />"></script>
    <script src="<s:url value="js/lib/angular/ui-bootstrap-tpls-0.10.0.js" />"></script>
    <%-- <script src="locale/locale_<s:text name="id"/>.js"></script> --%>
 	<script src="locale/locale_en.js"></script>
	<script src="js/realTime.js"></script>
	
	<script src="<s:url value="js/lib/typeahead/typeahead.js" />"></script>
	<script src="<s:url value="js/lib/typeahead/angular-typeahead.js" />"></script>
	
	<script src="<s:url value="js/lib/angularScroll/angularScroll.js" />"></script>

	<script src="<s:url value="js/appController.js" />"></script>
	<script src="js/services.js"></script>
	<script src="<s:url value="js/myClassController.js" />"></script>
	<script src="<s:url value="js/swapController.js" />"></script>
	<script src="js/directives.js"></script>
	<script src="<s:url value="js/routing.js" />"></script>

	<!-- Google Analytics -->
	<script>
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	
		ga('create', 'UA-48837198-1', 'auto');
	</script>
	
</head>
<body>

<div ng-controller="AppController">

	<div class="menu">
		<!-- Investigate for future release. Adds a filter bar to menu
		<form>
			<div class="row collapse">
				<div class="small-2 columns">
					<div class="prefix" style= "background-color: white;">
						<img src="images/glass.png" class="verticalClass" style="width: 40%;"/>
					</div>
				</div>
				<div class="small-10 columns">
					<input type="text" ng-model="searchTxt"></input>
				</div>
			</div>
		</form>-->

		<div ng-repeat="group in navLinks">
			<div ng-repeat="navs in group  | filter: searchTxt">
				<a class="menuLinks" href={{navs.url}}>{{ navs.name }}</a>
			</div>
			<hr >
		</div>
	</div>
	<div class="menuBtn">
		<button class=" toggle baseButton menuHover homeMenuButtons" type="submit" >menu</button>
	</div>

<div id="wrapper">
	<div id="headWrap">
		<div id="header" class="row collapse">
			<div id="headLeft" class="large-4 medium-12 small-12 columns">
				<img src="images/rit_logo_white.png" alt="RIT Logo"/><img src="images/rochester_it.png" alt="Rochester Institute of Technology Subtext"/>
			</div>
			<div id="headRight" class="large-5 large-offset-3 medium-12 small-12 columns">
				<s:url action="logout" var="logoutLink"></s:url>
				<a href="http://www.rit.edu/its/tigercentertalk" target="_blank">Feedback & Support</a> |
				<a href="http://www.rit.edu/directories" target="_blank">Directories</a> | 
				<a href="http://www.rit.edu/search" target="_blank">RIT Search</a> |
				<a href="http://www.rit.edu" target="_blank">RIT Home</a> | 
				<a href="${logoutLink}">Log Out</a>
			</div>
		</div>	
	</div>
	
	<!--Tiger Center Header -->
	<div class="panel">
		<div class="row rowSpacing text-center tcHeader">
			<span class="large-12 medium-12 small-12 columns">
	 			<h1 class="title"><a class="homeLink" href="{{homeUrl}}">TIGER CENTER</a></h1>
	 		</span>
	 		<br/>
	 		<br/>
	 	</div>
	</div>
	<!--End Tiger Center Header -->
	
	<div id="mainWrap">
		<div ng-if="ieversion > 0 && ieversion < 9">
			<div id="ieDisclaimer">
				You are using an older version of Microsoft&reg Internet Explorer&reg. You may experience errors, and your searches will be limited to {{rows}} rows. Learn more <a href="#/ie">here</a>.
			</div>
		</div>
	    <div ng-view></div>
	</div>
	<div id="footWrap">

		<div id="footer" class="row collapse">
			<p id="footerLeft" class="large-5 medium-12 small-12 columns">
				<a href="https://www.rit.edu/sito" alt="SITO Website">Developed by the Student IT Office</a> - Copyright © <a href="http://www.rit.edu" target="_blank">Rochester Institute of Technology.</a> All Rights Reserved

	
				<br><a href="http://www.rit.edu/copyright.html" target="_blank">Copyright Infringement </a>
	            | <a href="http://www.rit.edu/privacy.html" target="_blank">Privacy Statement </a>
	            | <a href="http://www.rit.edu/disclaimer" target="_blank">Disclaimer </a>
	            | <a href="http://www.rit.edu/nondiscrimination.html" target="_blank">Nondiscrimination </a>
	        </p>
	        <p id="footerRight" class="large-5 large-offset-2 medium-12 small-12 columns">
	            <a href="http://www.rit.edu/maps" target="_blank">One Lomb Memorial Drive, Rochester, NY 14623-5603 </a>
			    <br>Questions or comments? <a href="http://www.rit.edu/ask" target="_blank">Send us feedback. </a>Telephone: 585-475-2411
	        </p>
		</div>	
	</div>
</div>
</div>
<!-- Foundation files -->
	<script src="<s:url value="js/foundation/vendor/jquery.js"/>"></script>
	<script src="<s:url value="js/foundation/vendor/fastclick.js"/>"></script>
	<script src="<s:url value="js/foundation/foundation.min.js"/>"></script>
	<script src="<s:url value="js/foundation/responsive-tables.js"/>"></script>

</body>
</html>
