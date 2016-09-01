$().ready(function(){

    
    $.validator.addMethod('maxvalid', 
                          function(value, element) {
        if($('#MaxPrice').val() != '')
        {

        if(parseFloat($('#MaxPrice').val())  < parseFloat($('#MinPrice').val()))
        {

            return false;
        }
        else
        {
            
            return true;
        }
        }
        else
        {
            return true;
        }
    }, 
                         
     "Maximum price cannot be less than minimum or equal to zero"
  );
    
    $.validator.addMethod('minvalid', 
                          function(value, element) {
        if($('#MaxPrice').val() != '')
        {

        if(parseFloat($('#MaxPrice').val())  < parseFloat($('#MinPrice').val()))
        {

            return false;
        }
        else
        {
            
            return true;
        }
        }
        else
        {
            return true;
        }
    }, 
                         
     "Minimum price cannot be greater than maximum"
  );
    jQuery.validator.classRuleSettings.maxvalid = { maxvalid: true };
    jQuery.validator.classRuleSettings.minvalid = { minvalid: true };

    
       $("#myform").validate({
           errorClass: "my-error-class",
		   validClass: "my-valid-class",
               rules:
		{
			keywords:
			{
				required:true
			},
			MaxPrice:
			{
				number:true,
                maxvalid:true,
                min:0
			},
			MinPrice:
			{
				number:true,
                min:0,
                minvalid:true
			},
            Max_days:{
                
                digits:true,
                min:1
                
            }
		},
		messages:
		{
			keywords:
			{
				required:"Please enter a key word"
			},
			MaxPrice:
			{
				number:"Please enter a valid number",
                min:"Maximum price cannot be less than minimum or less than zero",
                maxvalid:"Maximum price cannot be less than minimum or less than zero"
        
			},
			MinPrice:
			{
				number:"Please enter a valid number",
                min:"Minimum price cannot be below zero",
                minvalid:"Minimum price cannot be greater than maximum"
			},
            Max_days:{
    
                digits:"Max handling time should be a valid digit",
                min:"Max handling time should be greater than or equal to 1"
                
            }
		},
           highlight: function(element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function(element) {
            $(element).closest('.form-group').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) {
            if(element.parent('.input-group').length) {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        }
       });
       });

function nextpage(pageNum)
{
    submitForm(pageNum);
    
}

function appendlashes( str ) 
   {
       return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
   }
function publishStory(title,picURL,itemURL,price,shippingCost,location) {
    var cost='';
    if(shippingCost == 0.0)
    {
        cost= '(FREE SHIPPING),';
    }
    else
    {
        cost = '(+$'+shippingCost+ 'for shipping),';
    }
    var input = 'Price:$'+price+cost+'Location:'+location;
  FB.ui({
    method: 'feed',
    name: decodeURIComponent(title),
    caption: input,
    description: 'search information from eBay.com',
    link: itemURL,
    picture: picURL
  }, 
  function(response) {
    console.log('publishStory response: ', response);
      if (response && !response.error_code) {
      alert('Posted Successfully');
    } else {
      alert('Not posted');
    }
  });
  return false;
}
$('#myform').validate();
function clearForm(oForm)
{
    //window.location="http://cs-server.usc.edu:60135/index.html";
    window.location=self.location;
}
function submitForm(pageNum)
{
     $("#keywords").removeClass("my-error-class");
			$("#keywordserror").text("");
			$("#keywords").addClass("my-valid-class");
		
		if($('#keywords').val()=='')
		{
			$("#keywords").addClass("my-error-class");
			$('#myform').validate();
			$("#keywordserror").append("Please enter a keyword");
				return false;
		}
		$('#myform').validate();
  
        var condition = new Array();
       $.each($("input[name='condition']:checked"), function(){            
           condition.push($(this).val());
       });
        var buy_format = new Array();
       $.each($("input[name='buy_format']:checked"), function(){            
           buy_format.push($(this).val());
       });
        var seller = new Array();
       $.each($("input[name='seller']:checked"), function(){            
           seller.push($(this).val());
       });
        var free_shipping = new Array();
       $.each($("input[name='free_shipping']:checked"), function(){            
           free_shipping.push($(this).val());
       });
        var expedited_shipping = new Array();
       $.each($("input[name='expedited_shipping']:checked"), function(){            
           expedited_shipping.push($(this).val());
       });
        $.ajax({
                   
            url: "test.php",
                    type: "GET",           
                    dataType: "json",
                    data: {keyword: $('#keywords').val(),
                           MinPrice:$('#MinPrice').val(),
                           MaxPrice:$('#MaxPrice').val(),
                           sort_by:$('#sort_by').val(),
                           results_display:$('#results_display').val(),
                           condition:condition,
                           buy_format:buy_format,
                           seller:seller,
                           free_shipping:free_shipping,
                           expedited_shipping:expedited_shipping,
                           Max_days:$('#Max_days').val(),
                           pageNum:pageNum
                           
                          },
            
                    success:function(data){
                        
                        $('div#success').html('');
                        $('div#fail').html('');
                        var disp = '';
                    
                        
                        var totalentry = parseFloat(data['resultCount']);
                        if(totalentry == 0)
                        {
                            disp +='<h6 style= "font-size:150%">No Results Found</h6>';
                        }
                        else
                        {
                        var currentpage = parseFloat(data['pageNumber']);
                        var pagesPerEntry = parseFloat(data['itemCount']); 
                        var totalpages = Math.ceil(totalentry/pagesPerEntry);
                        var start = ((currentpage-1)*pagesPerEntry)+1;
                        var end = (start - 1) +pagesPerEntry;
                            if(end>totalentry)
                            {
						end=totalentry;
                            }
                        
                        disp+= '<h3 style= "font-size:125%">'+start+'-'+end+' items out of '+totalentry+'</h3>';

                        
							for (i = 0; i <data['itemCount']; i++) {
                            var item = "item"+i;
                                if(data[item] == null)
                                {
                                    break;
                                }
                            var title = data[item]['basicInfo']['title'];
                         
							var link =data[item]['basicInfo']['viewItemURL'];
                            var gallery =data[item]['basicInfo']['galleryURL'];
                                
						/*top panel display*/
                                
                                disp += '<ul class="media-list">';
                                disp +=  '<li class="media">';
                                disp += '<a class="pull-left" href="#myModal'+i+'">';
                                disp += '<img class="media-object"src='+data[item]['basicInfo']['galleryURL']+' alt="Generic placeholder image" data-toggle="modal" data-target="#myModal'+i+'"" width = "64px" height = "64px"> </a>';
                                disp += '<div class="media-body">';
                                disp += '<a class="media-heading" href='+data[item]['basicInfo']['viewItemURL']+ 'target="_blank">'+data[item]['basicInfo']['title']+'</a><br>';
                                
                                
                                 /*Modal implementation*/
                                disp +='<div class="modal fade imgmiddle" id="myModal'+i+'"tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
                               
                                disp +='<div class="modal-dialog">';
                                disp +='<div class="modal-content">';
                                disp+='<div class="modal-header">';
                                disp+='<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
                                disp +='<h4 class="modal-title" id="myModalLabel">'+title+'</h4></div>';
                                disp+='<div class="modal-body">';
                                //handle picture URL
                               if(((data[item]['basicInfo']['pictureURLSuperSize']) != '') &&((data[item]['basicInfo']['pictureURLSuperSize']) != null) && ((data[item]['basicInfo']['pictureURLSuperSize']) != ' '))
                                {
                                disp+='<center><img class="img-responsive" src="'+data[item]['basicInfo']['pictureURLSuperSize']+'" id="imagepreview'+i+'" ></center>';
                                }
                                else
                                {
                                    disp+='<center><img class="img-responsive" src="'+data[item]['basicInfo']['galleryURL']+' " id="imagepreview'+i+'" ></center>';     
                                }
                                disp+='</div></div></div></div>';
                                /*Modal end*/
                                
                                
                                disp += '<b> Price:$'+data[item]['basicInfo']['convertedCurrentPrice']+'</b>'
                                if((data[item]['basicInfo']['shippingServiceCost'] == 0.0) 
                                   || (data[item]['basicInfo']['shippingServiceCost'] == ''))
                                {
                                disp += '(FREE SHIPPING)&nbsp'
                                }
                                else
                                {
                                    disp += '(<b>+$'+data[item]['basicInfo']['shippingServiceCost']+'</b> for shipping)&nbsp';
                                }
                                disp +='<i> Location:'+data[item]['basicInfo']['location']+'</i>&nbsp';
                                if((data[item]['sellerInfo']['topRatedSeller']) == 'true')
                                {
                                disp+='<img src="http://cs-server.usc.edu:45678/hw/hw8/itemTopRated.jpg"style="width: 20px; height: 20px;" >';
                                }
                                
                                disp +='<a  data-toggle="collapse" href="#hidetab'+i+'">View details </a>';
                               // disp +='<a class="collapsed" data-toggle="collapse" data-parent="#accordion"  href="#hidetab'+i+'">View details </a>';
                                disp += '<a href="#" onClick="publishStory(\'' + encodeURIComponent(appendlashes(data[item]['basicInfo']['title'])) + '\',\'' + data[item]['basicInfo']['galleryURL'] + '\',\'' + data[item]['basicInfo']['viewItemURL'] + '\',\'' + data[item]['basicInfo']['convertedCurrentPrice'] + '\',\'' + data[item]['basicInfo']['shippingServiceCost'] + '\',\'' + data[item]['basicInfo']['location'] +'\');"><img src="http://cs-server.usc.edu:45678/hw/hw8/fb.png" width="17" height="17" /></a>';

                               
                                
                                /*Facebook function end*/
                                
                            /*Top panel End*/
                                
                                
                                disp +='<div class="panel-body"><div class="col-md-8 col-xs-12" role="tabpanel" >';
                                disp +='<div class="collapse" id="hidetab'+i+'">';
                                disp +='<ul class="nav nav-tabs" role="tablist">';
                                disp +='<li role="presentation" class="active"><a href="#basicInfo'+i+'" aria-controls="basicInfo'+i+'" role="tab" data-toggle="tab">BasicInfo</a></li>';
                                disp +='<li role="presentation"><a href="#sellerInfo'+i+'" aria-controls="sellerInfo'+i+'" role="tab" data-toggle="tab">SellerInfo</a></li>';
                                disp +='<li role="presentation"><a href="#shippingInfo'+i+'" aria-controls="shippingInfo'+i+'" role="tab" data-toggle="tab">ShippingInfo</a>';
                                disp +='</li></ul>';
                                
                                disp +='<div class="tab-content">';
                                
                                disp +='<div role="tabpanel" class="tab-pane active" id="basicInfo'+i+'">';
                                
                               
                               disp +='<table style="font-size:13px;">';
                                if(data[item]['basicInfo']['categoryName'] != '')
                                {
                                    disp +='<tr><th width="200">Category name</th><td>'+data[item]['basicInfo']['categoryName']+'</td></tr>';
                                }
                                else
                                {
                                   disp +='<tr><th width="200">Category name</th><td> N/A </td></tr>'; 
                                }
                                if(data[item]['basicInfo']['conditionDisplayName'] != '')
                                {
                                disp +='<tr><th width="200">Condition</th><td>'+data[item]['basicInfo']['conditionDisplayName']+'</td></tr>';
                                }
                                else
                                {
                                    disp +='<tr><th width="200">Condition</th><td> N/A </td></tr>'; 
                                }
                                disp +='<tr><th width="200">Buying format</th>';
                                if ( (data[item]['basicInfo']['listingType']) != '')
                                {
                                    listingType = data[item]['basicInfo']['listingType'];
                                    if (listingType == 'FixedPrice' || listingType == 'StoreInventory')
                                    {
                                        disp +=  '<td>Buy It Now</td>';
                                    }
                                    else if(listingType == 'Auction')
                                    {
                                        disp += '<td>Auction</td>';
                                    }
                                    else if(listingType == "Classified")
                                    {
                                        disp += '<td>Classified Ad</td>';
                                    }
                                    else
                                    {
                                        disp += '<td>'+listingType+'</td>';
                                    }
                                }
                                else
                                {
                                    disp +=  '<td> N/A </td>';
                                }
                                disp+='</tr> </table>';
                               
                               
                    
                                disp +='</div>';  /*basic info end*/
                                
                         
                                disp +='<div role="tabpanel" class="tab-pane" id="sellerInfo'+i+'">';
                                
                                disp+='<table style="font-size:13px;">';
                                if(data[item]['sellerInfo']	['sellerUserName'] != '')
                                    
                                {
                                disp+='<tr><th width="200">User Name</th><td>'+data[item]['sellerInfo']	
['sellerUserName']+'</td></tr>'; 
                                }
                                else
                                {
                                    disp+='<tr><th width="200">User Name</th><td> N/A </td></tr>';
                                }
                                
                                if(data[item]['sellerInfo']	['feedbackScore'] != '')
                                {
                                disp+='<tr><th width="200">Feedback score</th><td>'+data[item]['sellerInfo']	
['feedbackScore']+'</td></tr>';
                                }
                                else
                                {
                                    disp+='<tr><th width="200">Feedback score</th><td> N/A </td></tr>';
                                }
                                if(data[item]['sellerInfo']['positiveFeedbackPercent'] != '')
                                {
                                disp+='<tr><th width="200">Positive feeback</th><td>'+data[item]['sellerInfo']	
['positiveFeedbackPercent']+'%</td></td>';
                                }
                                else
                                {
                                    disp+='<tr><th width="200">Positive feeback</th><td> N/A </td></td>';
                                    
                                }
                                if(data[item]['sellerInfo']	['feedbackRatingStar'] != '')
                                {
                                disp+='<tr><th width="200">Feedback rating</th><td>'+data[item]['sellerInfo']	
['feedbackRatingStar']+'</td></tr>';
                                }
                                else
                                {
                                    disp+='<tr><th width="200">Feedback rating</th><td> N/A </td></tr>';
                                    
                                }
                                if((data[item]['sellerInfo']['topRatedSeller']) == 'true')
                                {
                                disp+='<tr><th width="200">Top rated</th><td><span class="glyphicon glyphicon-ok" style="color:green"></td></tr>';
                                }
                                else
                                {
                                  disp+='<tr><th width="200">Top rated</th><td><span class="glyphicon glyphicon-remove" style="color:red"></td></tr>';  
                                }
                                if((data[item]['sellerInfo']['sellerStoreName']) != '')
                                {
                                disp+='<tr><th width="200">Store</th><td><a href="'+data[item]['sellerInfo']['sellerStoreURL']+ '"target="_blank">'+data[item]['sellerInfo']['sellerStoreName']+'</a></td></tr>';  
                                }
                                else
                                {
                                    disp+='<tr><th width="200">Store</th><td>N/A</td></tr>';
                                    
                                }
                                disp+='</table>';
                                
                                
                                disp+='</div>';
                                
                                
                                /* sellerInfo end*/
                                
                                
                                disp +='<div role="tabpanel" class="tab-pane" id="shippingInfo'+i+'">';
                                
                                disp+='<table style="font-size:13px;">';
                                if(data[item]['shippingInfo']['shippingType'] != '')
                                {
                                disp+='<tr><th width="200">Shipping type</th><td>'+data[item]['shippingInfo']['shippingType']+'</td></tr>';   
                                }
                                else
                                {
                                   disp+='<tr><th width="200">Shipping type</th><td>N/A</td></tr>';   
                                }
                                if(data[item]['shippingInfo']['handlingTime'] != '')
                                {
                                disp+='<tr><th width="200">Handling time</th><td>'+data[item]['shippingInfo']['handlingTime']+'days(s)</td></tr>';
                                }
                                else
                                {
                                    disp+='<tr><th width="200">Handling time</th><td>N/A</td></tr>';
                                }
                                if(data[item]['shippingInfo']['shipToLocations'] != '')
                                {
                                disp+='<tr><th width="200">Shipping locations</th><td>'+data[item]['shippingInfo']['shipToLocations']+'</td></tr>';
                                }
                                else
                                {
                                   disp+='<tr><th width="200">Shipping locations</th><td>N/A</td></tr>'; 
                                }
                                if((data[item]['shippingInfo']['expeditedShipping']) == 'true')
                                {
                                disp+='<tr><th width="200">Expedited shipping</th><td><span class="glyphicon glyphicon-ok" style="color:green"></td></tr>';
                                }
                                else
                                {
                                  
                                    disp+='<tr><th width="200">Expedited shipping</th><td><span class="glyphicon glyphicon-remove" style="color:red"></td></td>';
                                }
                                
                                if((data[item]['shippingInfo']['oneDayShippingAvailable']) == 'true')
                                {
                                disp+='<tr><th width="200">One Day shipping</th><td><span class="glyphicon glyphicon-ok" style="color:green"></td></tr>';
                                }
                                else
                                {
                                   disp+='<tr><th width="200">One Day shipping</th><td><span class="glyphicon glyphicon-remove" style="color:red"></td></tr>'; 
                                }
                                
                                if((data[item]['shippingInfo']['returnsAccepted']) == 'true')
                                {
                                disp+='<tr><th width="200">Returns accepted</th><td><span class="glyphicon glyphicon-ok" style="color:green"></td></td>'; 
                                }
                                else
                                {
                                    disp+='<tr><th width="200">Returns accepted</th><td><span class="glyphicon glyphicon-remove" style="color:red"></td></td>'; 
                                }
                                disp+='</table>';
                                
                                disp+='</div>';/*shipping info end*/
                                
                                
                            
                                
                                disp+='</div>'; /*tab content end*/
                                    
                                 disp+='</div></div>';/*tabpanel and collapse end*/
                                disp += '</li></ul></div></div>';/*media end*/
                                       
                                
          
                        }
                                          
       var startpage=1;
       
		for (var i=1 ; i<= totalpages ; i+=5)
		{
			if(currentpage - i < 5)
			{
				startpage = i;
				break;
			}
		}
		
		if(currentpage-1 <=0)
			disp += ('<nav><ul class="pagination"><li class="disabled"><a href="#" aria-label="Previous"> <span aria-hidden="true">&laquo;</span></a></li>');
		else
		{
				var str = currentpage - 1;
				disp += ('<nav><ul class="pagination"><li><a href="javascript:nextpage(\'' + str + '\' )" aria-label="Previous"> <span aria-hidden="true">&laquo;</span></a></li>');
		
		
		}
		var j=0;
		for (var i=startpage;i<startpage+5;i++)
		{
			if(i>totalpages)
				break;
			if(currentpage==i)
				disp += ('<li class="active"><a href="javascript:nextpage(\'' + i + '\' )">'+i+'</a></li>');
			else
				disp += ('<li><a href="javascript:nextpage(\'' + i + '\' )"">'+i+'</a></li>');
			j++;	
				
		}
		if(currentpage+1 > totalpages)
			disp += ('<li class="disabled"><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>  </li>  </ul></nav>');
		else
		{
			var str = currentpage + 1;
			disp += ('<li><a href="javascript:nextpage(\'' + str + '\' )" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>  </li>  </ul></nav>');
		}	
                        }
		                
                        $('div#success').html(disp);
                            
                       },
                       error:function()
                       {
                           $('div#fail').html('');
                           $('div#success').html('');
                           var err = '';
                           err +='<h6 style= "font-size:125%">No Results Found</h6>';
                           $('div#fail').html(err);
                              
                       }
            });
}
               
               

