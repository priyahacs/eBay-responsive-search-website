<?php
 header('Content-type: application/json; charset=UTF-8');
 //http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
 //$key = $_GET["keyyword"];

$endpoint = 'http://svcs.ebay.com/services/search/FindingService/v1';  // URL to call
$version = '1.0.0';  // API version supported by your application
$appid = 'USC186cab-94a7-4709-a483-f723ca9d8a5';  // Replace with your own AppID
$globalid = 'EBAY-US';  // Global ID of the eBay site you want to search (e.g., EBAY-DE)
$query=$_GET["keyword"];
//echo $query;
//$safequery = urlencode($query);  // Make the query URL-friendly 
$safequery = $query;
$resultsPerPage=$_GET["results_display"];
//echo $resultsPerPage;
$sortorder=$_GET["sort_by"];
$pageNum=$_GET["pageNum"];
global $i;
$i = '0';
$apicall = "$endpoint?";
$apicall .="siteid=0";
$apicall .= "&OPERATION-NAME=findItemsByKeywords";
$apicall .= "&SERVICE-VERSION=$version";
$apicall .= "&SECURITY-APPNAME=$appid";
$apicall .= "&RESPONSE-DATAFORMAT=XML";
$apicall .= "&GLOBAL-ID=$globalid";
$apicall .= "&keywords=$safequery";
$apicall .= "&paginationInput.entriesPerPage=$resultsPerPage";
$apicall .= "&sortOrder=$sortorder";
$apicall .= "&paginationInput.pageNumber=$pageNum";

if($_GET["MinPrice"] !="")
    {
    $minPrice=$_GET["MinPrice"];
    //echo $minPrice;
    $apicall .="&itemFilter[$i].name=MinPrice&itemFilter[$i].value=$minPrice";
    $i++;
}
    if($_GET["MaxPrice"] !="")
    {
    $maxPrice=$_GET["MaxPrice"];
    //echo $maxPrice;
    $apicall .="&itemFilter[$i].name=MaxPrice&itemFilter[$i].value=$maxPrice";
    $i++;
}


if( !empty( $_GET["condition"] ) )
{
$y='0';
    
    $apicall .="&itemFilter[$i].name=Condition";
foreach ($_GET['condition'] as $s )
{
   

$apicall .="&itemFilter[$i].value[$y]=$s";
$y++;

}
    $i++;
}

if(!empty($_GET["buy_format"])){
$z='0';
//$Listingname = $_GET["buy_format"];
    $apicall .="&itemFilter[$i].name=ListingType";
foreach($_GET['buy_format'] as $listselected)
{
   // 
    $apicall .="&itemFilter[$i].value[$z]=$listselected";
    //echo $listselected;
$z++;

}
    $i++;
}

if(isset($_GET["seller"])) {
    //echo $_GET["seller"];
    //echo "hello am inside seller";
    $apicall .="&itemFilter[$i].name=ReturnsAcceptedOnly&itemFilter[$i].value=true";
    $i++;
}
if(isset($_GET["free_shipping"])) {
    $apicall .="&itemFilter[$i].name=FreeShippingOnly&itemFilter[$i].value=true";
    $i++;
}
if(isset($_GET["expedited_shipping"])) {
    $apicall .="&itemFilter[$i].name=ExpeditedShippingType&itemFilter[$i].value=Expedited";
    $i++;
}


    if($_GET["Max_days"] !="")
    {
    $max=$_GET["Max_days"];
    //$safemax = urlencode($max);
    //echo "hello am inside max handling";
    $apicall .="&itemFilter[$i].name=MaxHandlingTime&itemFilter[$i].value=$max";
    $i++;
}
$apicall.= "&outputSelector[0]=SellerInfo&outputSelector[1]=StoreInfo&outputSelector[2]=PictureURLSuperSize";
$resp = simplexml_load_file($apicall);

// Check to see if the request was successful, else print an error
    class result{
        public $ack="";
        public $resultCount="";
        public $pageNumber="";
        public $itemCount="";
    }
    
    class item
  {
        public $basicInfo="";
        public $sellerInfo="";
        public $shippingInfo="";
          
    }
            class basicInfo
            {
                public $title="";
                public $viewItemURL="";
                public $galleryURL="";
                public $pictureURLSuperSize="";
                public $convertedCurrentPrice="";
                public $shippingServiceCost="";
                public $conditionDisplayName="";
                public $listingType="";
                public $location="";
                public $categoryName="";
                public $topRatedListing="";
                
            }
    
            class sellerInfo{
                public $sellerUserName="";
                public $feedbackScore="";
                public $positiveFeedbackPercent="";
                public $feedbackRatingStar="";
                public $topRatedSeller="";
           
            }
       class shippingInfo{
                public $shippingType="";
                public $shipToLocations="";
                public $expeditedShipping="";
                public $oneDayShippingAvailable="";
                public $returnsAccepted="";
                public $handlingTime="";
            }
    
               

    $entry=new result();
   
    if ($resp->ack == "Success") {    
        
    
    
      
    $entry->resultCount =(string) $resp->paginationOutput->totalEntries;
   if( $entry->resultCount == 0)
   {
       $result = "No results found";
       $entry->ack = $result;
   }
    else
    {
        
        $entry->ack = (string)$resp->ack;
         $entry->pageNumber= (string)$resp->paginationOutput->pageNumber;
        $entry->itemCount= (string)$resp->paginationOutput->entriesPerPage;
        
        $i =0;
        foreach($resp->searchResult->children() as $item)
	   {
		   $basic[$i]=new basicInfo();
		   $seller[$i]=new sellerInfo();
		   $ship[$i]=new shippingInfo();
		   $append[$i]=new item();
		   $name="item".$i;
		   $basic[$i]->title=(string)$item->title;
		   $basic[$i]->viewItemURL=(string)$item->viewItemURL;
		   $basic[$i]->galleryURL=(string)$item->galleryURL;
		   $basic[$i]->pictureURLSuperSize=(string)$item->pictureURLSuperSize;
		   $basic[$i]->convertedCurrentPrice=(string)$item->sellingStatus->convertedCurrentPrice;
		   $basic[$i]->shippingServiceCost=(string)$item->shippingInfo->shippingServiceCost;
		   $basic[$i]->conditionDisplayName=(string)$item->condition->conditionDisplayName;
		 	$basic[$i]->listingType=(string)$item->listingInfo->listingType;
			$basic[$i]->location=(string)$item->location;
			$basic[$i]->categoryName=(string)$item->primaryCategory->categoryName;
		 	$basic[$i]->topRatedListing=(string)$item->topRatedListing;
		   $entry->$name=$append[$i];
		   $append[$i]->basicInfo=$basic[$i];
		 	$seller[$i]->sellerUserName=(string)$item->sellerInfo->sellerUserName;
		 	$seller[$i]->feedbackScore=(string)$item->sellerInfo->feedbackScore;
		 	$seller[$i]->positiveFeedbackPercent=(string)$item->sellerInfo->positiveFeedbackPercent;
			$seller[$i]->feedbackRatingStar=(string)$item->sellerInfo->feedbackRatingStar;
			$seller[$i]->topRatedSeller=(string)$item->sellerInfo->topRatedSeller;
		 	$seller[$i]->sellerStoreName=(string)$item->storeInfo->storeName;
		 	$seller[$i]->sellerStoreURL=(string)$item->storeInfo->storeURL;
		   $append[$i]->sellerInfo=$seller[$i];
		 	$ship[$i]->shippingType=(string)$item->shippingInfo->shippingType;
		 	$ship[$i]->shipToLocations=(string)$item->shippingInfo->shipToLocations;
		 	$ship[$i]->expeditedShipping=(string)$item->shippingInfo->expeditedShipping;
		 	$ship[$i]->oneDayShippingAvailable=(string)$item->shippingInfo->oneDayShippingAvailable;
		 	$ship[$i]->handlingTime=(string)$item->shippingInfo->handlingTime;
            $ship[$i]->returnsAccepted=(string)$item->returnsAccepted;
		   $append[$i]->shippingInfo=$ship[$i];
		   $i++;
	   }
    /*for($i=0;$i<(int)$resp->paginationOutput->entriesPerPage;$i++)
   {
        $entry->pageNumber= (string)$resp->paginationOutput->pageNumber;
        $entry->itemCount= (string)$resp->paginationOutput->entriesPerPage;
        
	   $basic[$i]=new basicInfo();
	   $seller[$i]=new sellerInfo();
        
	   $ship[$i]=new shippingInfo();
	   $append[$i]=new item();
	   $name="item".$i;
        
	   $basic[$i]->title=(string)$resp->searchResult->item[$i]->title;
       //$basic[$i]->viewItemURL=(string)$resp->searchResult->item[$i]->viewItemURL;
        $basic[$i]->viewItemURL=(string)$resp->searchResult->item[$i]->viewItemURL;
        //echo $basic[$i]->viewItemURL;
       $basic[$i]->galleryURL=(string)$resp->searchResult->item[$i]->galleryURL;
	   $basic[$i]->pictureURLSuperSize=(string)$resp->searchResult->item[$i]->pictureURLSuperSize;
	   $basic[$i]->convertedCurrentPrice=(string)$resp->searchResult->item[$i]->sellingStatus->convertedCurrentPrice;
	   $basic[$i]->shippingServiceCost=(string)$resp->searchResult->item[$i]->shippingInfo->shippingServiceCost;
	   $basic[$i]->conditionDisplayName=(string)$resp->searchResult->item[$i]->condition->conditionDisplayName;
	   $basic[$i]->listingType=(string)$resp->searchResult->item[$i]->listingInfo->listingType;
	   $basic[$i]->location=(string)$resp->searchResult->item[$i]->location;
	   $basic[$i]->categoryName=(string)$resp->searchResult->item[$i]->primaryCategory->categoryName;
	   $basic[$i]->topRatedListing=(string)$resp->searchResult->item[$i]->topRatedListing;
	   $entry->$name=$append[$i];
	   $append[$i]->basicInfo=$basic[$i];
       
        
	   $seller[$i]->sellerUserName=(string)$resp->searchResult->item[$i]->sellerInfo->sellerUserName;
	   $seller[$i]->feedbackScore=(string)$resp->searchResult->item[$i]->sellerInfo->feedbackScore;
	   $seller[$i]->positiveFeedbackPercent=(string)$resp->searchResult->item[$i]->sellerInfo->positiveFeedbackPercent;
	   $seller[$i]->feedbackRatingStar=(string)$resp->searchResult->item[$i]->sellerInfo->feedbackRatingStar;
	   $seller[$i]->topRatedSeller=(string)$resp->searchResult->item[$i]->sellerInfo->topRatedSeller;
        
	   $seller[$i]->sellerStoreName=(string)$resp->searchResult->item[$i]->storeInfo->storeName;
	   $seller[$i]->sellerStoreURL=(string)$resp->searchResult->item[$i]->storeInfo->storeURL;
       $append[$i]->sellerInfo=$seller[$i];
        
	   $ship[$i]->shippingType=(string)$resp->searchResult->item[$i]->shippingInfo->shippingType;
        $shiptoLocs = [];
        foreach($resp->searchResult->item[$i]->shippingInfo->shipToLocations as $loc)
        array_push($shiptoLocs,$loc);
       $ship[$i]->shipToLocations= implode(",",$shiptoLocs);
	   $ship[$i]->expeditedShipping=(string)$resp->searchResult->item[$i]->shippingInfo->expeditedShipping;
	   $ship[$i]->oneDayShippingAvailable=(string)$resp->searchResult->item[$i]->shippingInfo->oneDayShippingAvailable;
	   $ship[$i]->handlingTime=(string)$resp->searchResult->item[$i]->shippingInfo->handlingTime;
	   $append[$i]->shippingInfo=$ship[$i];
        
    }*/
    }
        echo json_encode($entry);
        }

// If the response does not indicate 'Success,' print an error
else {
    echo"Results not found";
}


    //echo json_encode($happy);
?>