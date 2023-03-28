		//UAT
			if ("OTPCredential" in window) {
			    window.addEventListener("DOMContentLoaded", (e) => {
			        const input = document.querySelector('input[autocomplete="one-time-code"]');

			        if (!input) return;

			        const ac = new AbortController();
			        const form = input.closest("form");

			        if (form) {
			            form.addEventListener("submit", (e) => {
			                ac.abort();
			            });
			        }
			        navigator.credentials
			            .get({
			                otp: {
			                    transport: ["sms"],
			                },
			                signal: ac.signal,
			            })
			            .then((otp) => {
			                input.value = otp.code;
			                $(".a_otpPart .otpButton button").show();
			                console.log(9);
			                console.log("OTP Code== " + otp.code);
			                $("#cardOtpF2 .btnstyl").trigger("click");
			            })
			            .catch((err) => {
			                console.log(err);
			                console.log(10);
			            });
			    });
			}
			/* OTP Autofill Ends*/
			
			// Added for checkConfirm read mor or less  on 30-JAn-2023      
			
			if ($(window).width() < 768) {
			  setTimeout(function () {
			    $(".checkConfirm label").show();
			  }, 200);
			
			  var showChar = 80;
			  var ellipsestext = "...";
			  var moretext = "Read more";
			  var lesstext = "Read less";
			
			  $(".more").each(function () {
			    var content = $(this).html();
			
			    if (content.length > showChar) {
			      var c = content.substr(0, showChar);
			      var h = content.substr(showChar, content.length - showChar);
			
			      var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + "</a></span>";
			
			      $(this).html(html);
			    }
			  });
			
			  $(".morelink").click(function () {
			    if ($(this).hasClass("less")) {
			      $(this).removeClass("less");
			      $(this).html(moretext);
			    } else {
			      $(this).addClass("less");
			      $(this).html(lesstext);
			    }
			    $(this).parent().prev().toggle();
			    $(this).prev().toggle();
			    return false;
			  });
			}			
						

			/* copy paste cut disable */
			$("body").bind("cut copy paste", function (e) {
			    e.preventDefault();
			});

			$(document).ready(function () {
			    var csrftoken = "";
			    var TokenCSRF = "";
			    var csrfcookie = "";
			    var encData;
			    var otpRequestId, podRequestId, mobile, sourceChannelIp;
			    var clickText, retryPageHandling;
			    var eventCondition = "False";
			    var otpcounter = 0;
			    var counter = 0;
			    var seconds, currntTime;
			    var cardSubType;
			    var pageReloadIndentifier;

			    var API_Domain = "https://uatwebservices.bajajfinserv.in/";
			    var domain = location.hostname.replace("www", "");
			    var PageURL;
			    var Pageurl = GetCookie("pageurl");
			    if (!Pageurl) {
			        console.log("from location.href");
			        PageURL = $(location).attr("href");
			        setCookie("pageurl", PageURL);
			    } else {
			        console.log("from cookie");
			        PageURL = Pageurl;
			    }
			    var ChannelIp = document.domain;

			    if (ChannelIp == "cont-sites.bajajfinserv.in") {
			        sourceChannelIp = "23.46.9.120";
			    } else if (ChannelIp == "www.bajajfinserv.in") {
			        sourceChannelIp = "23.212.242.125";
			    }

			    var channelId, partnerApplicationId;
			    var customerFullName,
			        Custdob,
			        cardType,
			        primaryAddonIndicator,
			        podRequestId,
			        _csrf;

			    var errorCode, message;
			    var tncVersionNumber, tncFlag, retryScenario;
			    var addressStatus, relationshipStatus;
			    var validFrom,
			        validTill,
			        cust_type,
			        nextStage,
			        referID,
			        parentNameform,
			        source_cust_type;
			    var paymentGatewayURL, paymentGatewayParameters, payparameter, mandatePodUrl;

			    validFrom = new Date();
			    var dd = String(validFrom.getDate()).padStart(2, "0");
			    var mm = String(validFrom.getMonth() + 1).padStart(2, "0"); //January is 0!
			    var yyyy = validFrom.getFullYear();
			    validFrom = mm + "/" + yyyy;
			    validTill = mm + "/" + (yyyy + 10);
			    var mandate = dd + "/" + mm + "/" + yyyy;
			    $(".page1 #mobNumemi_insta label[for='mobNumb']").addClass("active");

			    function setCookie(cname, cvalue) {
			        var d = new Date();
			        d.setTime(d.getTime() + 30 * 60 * 1000);
			        var expires;
			        document.cookie =
			            cname +
			            "=" +
			            cvalue +
			            ";" +
			            expires +
			            "; domain=" +
			            domain +
			            ";path=/ " +
			            "; secure";
			    }

			    function getCookie(cname) {
			        var name = cname + "=";
			        var decodedCookie = decodeURIComponent(document.cookie);
			        var ca = decodedCookie.split(";");
			        for (var i = 0; i < ca.length; i++) {
			            var c = ca[i];
			            while (c.charAt(0) == " ") {
			                c = c.substring(1);
			            }
			            if (c.indexOf(name) == 0) {
			                return c.substring(name.length, c.length);
			            }
			        }
			        return "";
			    }
			    
			    /*set cookie for productoffering */
			    setCookie("productOfferingType", 1);

			    /* cookie encryption decryption */
			    var keySize = 256;
			    var iterations = 100;
			    var pkd = "secrete";
			    // nmk = salt
			    // chb = key
			    // tv  = iv
			    // dk  = pass
			    function encryptlocal(message, dk) {
			        var nmk = CryptoJS.lib.WordArray.random(128 / 8);
			        var chb = CryptoJS.PBKDF2(dk, nmk, {
			            keySize: keySize / 32,
			            iterations: iterations,
			        });
			        var tv = CryptoJS.lib.WordArray.random(128 / 8);
			        var encrypted = CryptoJS.AES.encrypt(message, chb, {
			            iv: tv,
			            padding: CryptoJS.pad.Pkcs7,
			            mode: CryptoJS.mode.CBC,
			        });
			        //nmk, tv will be hex 32 in length
			        //append them to the ciphertext for use in decryption
			        var transitmessage = nmk.toString() + tv.toString() + encrypted.toString();
			        return transitmessage;
			    }

			    function decrypt(transitmessage, dk) {
			        var nmk = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
			        var tv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32));
			        var encrypted = transitmessage.substring(64);
			        var chb = CryptoJS.PBKDF2(dk, nmk, {
			            keySize: keySize / 32,
			            iterations: iterations,
			        });
			        var decrypted = CryptoJS.AES.decrypt(encrypted, chb, {
			            iv: tv,
			            padding: CryptoJS.pad.Pkcs7,
			            mode: CryptoJS.mode.CBC,
			        });
			        return decrypted;
			    }

			    /* generating token */
			    function totkenGeneartionApi() {
			        var tokendata = {
			            url: API_Domain + "api/v1/csrf",
			            method: "GET",
			            async: false,
			            headers: {
			                "Content-Type": "application/json",
			                source: "IEMI POD2 PMG",
			                urlPath: "insta-emi-network-card-apply-online",
			            },
			            crossDomain: "true",
			            xhrFields: {
			                withCredentials: "true",
			            },
			        };
			        $.ajax(tokendata).done(function (response) {
			            console.log("csrf from api");

			            if (response.data._csrf) {
			                TokenCSRF = response.data._csrf;
			            }
			            setCookie("CSRFtoken", TokenCSRF);
			        });
			    }
			    TokenCSRF = GetCookie("CSRFtoken");
			    if (!TokenCSRF) {
			        totkenGeneartionApi();
			    } else {
			        console.log("csrf from cookies");
			    }
			    /* token generated */

			    $.fn.serializeObject = function () {
			        var o = {};
			        var a = this.serializeArray();
			        $.each(a, function () {
			            if (o[this.name] !== undefined) {
			                if (!o[this.name].push) {
			                    o[this.name] = [o[this.name]];
			                }
			                o[this.name].push(this.value || "");
			            } else {
			                o[this.name] = this.value || "";
			            }
			        });
			        return o;
			    };

			    //for slick slider
			    $(".shopOnSlider").slick({
			        dots: false,
			        arrows: true,
			        infinite: false,
			        speed: 300,
			        slidesToShow: 8,
			        slidesToScroll: 7,
			        responsive: [
			            {
			                breakpoint: 1025,
			                settings: {
			                    slidesToShow: 5.4,
			                    slidesToScroll: 5,
			                    dots: true,
			                },
			            },
			            {
			                breakpoint: 769,
			                settings: {
			                    slidesToShow: 8.1,
			                    slidesToScroll: 8,
			                    dots: true,
			                },
			            },
			            {
			                breakpoint: 600,
			                settings: {
			                    slidesToShow: 4.1,
			                    slidesToScroll: 4,
			                },
			            },
			            {
			                breakpoint: 480,
			                settings: {
			                    slidesToShow: 3.05,
			                    slidesToScroll: 3,
			                    arrows: false,
			                },
			            },
			            {
			                breakpoint: 374,
			                settings: {
			                    slidesToShow: 2.5,
			                    slidesToScroll: 2,
			                    arrows: false,
			                },
			            },
			        ],
			    });

			    $(".wlcmSlider").slick({
			        dots: false,
			        arrows: false,
			        infinite: false,
			        slidesToShow: 2.78,
			        // lazyLoad: 'ondemand',
			        slidesToScroll: 3,
			        responsive: [
			            {
			                breakpoint: 1024,
			                settings: {
			                    slidesToShow: 2.3,
			                    slidesToScroll: 1,
			                    infinite: true,
			                    dots: true,
			                },
			            },
			            {
			                breakpoint: 600,
			                settings: {
			                    slidesToShow: 1.2,
			                    slidesToScroll: 1,
			                },
			            },
			            {
			                breakpoint: 480,
			                settings: {
			                    slidesToShow: 1.05,
			                    slidesToScroll: 1,
			                    //  centerPadding: '49px',
			                    //arrows:false,
			                },
			            },
			        ],
			    });

			    $(".Exclusive_Offers_slide").slick({
			        dots: false,
			        arrows: true,
			        infinite: true,
			        speed: 300,
			        autoplay: true,
			        autoplaySpeed: 5000,
			        centerMode: true,
			        centerPadding: "43px",
			        slidesToShow: 3,
			        slidesToScroll: 3,
			        responsive: [
			            {
			                breakpoint: 1024,
			                settings: {
			                    slidesToShow: 2.3,
			                    slidesToScroll: 1,
			                    infinite: true,
			                    dots: true,
			                },
			            },
			            {
			                breakpoint: 600,
			                settings: {
			                    slidesToShow: 1.2,
			                    slidesToScroll: 1,
			                },
			            },
			            {
			                breakpoint: 480,
			                settings: {
			                    slidesToShow: 1,
			                    slidesToScroll: 1,
			                    centerPadding: "49px",
			                    arrows: false,
			                },
			            },
			        ],
			    });

			    $(".Exclusive_Offers_slide_2").slick({
			        dots: false,
			        arrows: true,
			        infinite: false,
			        speed: 300,
			        slidesToShow: 3.4,
			        slidesToScroll: 2,
			        responsive: [
			            {
			                breakpoint: 1024,
			                settings: {
			                    slidesToShow: 2.3,
			                    slidesToScroll: 1,
			                    infinite: true,
			                    dots: true,
			                },
			            },
			            {
			                breakpoint: 600,
			                settings: {
			                    slidesToShow: 1.2,
			                    slidesToScroll: 1,
			                },
			            },
			            {
			                breakpoint: 480,
			                settings: {
			                    slidesToShow: 1.3,
			                    slidesToScroll: 1,
			                    arrows: false,
			                },
			            },
			        ],
			    });

			    $(".Exclusive_Offers_slide_3").slick({
			        dots: false,
			        arrows: false,
			        infinite: true,
			        speed: 300,
			        autoplay: true,
			        autoplaySpeed: 5000,
			        centerMode: true,
			        centerPadding: "224px",
			        slidesToShow: 2,
			        slidesToScroll: 1,
			        responsive: [
			            {
			                breakpoint: 1024,
			                settings: {
			                    slidesToShow: 2.3,
			                    slidesToScroll: 1,
			                    infinite: true,
			                    dots: true,
			                },
			            },
			            {
			                breakpoint: 600,
			                settings: {
			                    slidesToShow: 1.2,
			                    slidesToScroll: 1,
			                },
			            },
			            {
			                breakpoint: 480,
			                settings: {
			                    slidesToShow: 1,
			                    slidesToScroll: 1,
			                    centerPadding: "49px",
			                    arrows: false,
			                },
			            },
			        ],
			    });

			    /* Slick for cheveron icon of review and ratings*/

			    $(".word_testimonial_main").slick({
			        dots: false,
			        arrows: true,
			        infinite: true,
			        speed: 300,
			        centerMode: true,
			        centerPadding: "150px",
			        slidesToShow: 2,
			        slidesToScroll: 2,
			        responsive: [
			            {
			                breakpoint: 1025,
			                settings: {
			                    slidesToShow: 2,
			                    centerPadding: "30px",
			                    slidesToScroll: 1,
			                    infinite: true,
			                    dots: true,
			                },
			            },
			            {
			                breakpoint: 600,
			                settings: {
			                    slidesToShow: 1.2,
			                    slidesToScroll: 1,
			                },
			            },
			            {
			                breakpoint: 480,
			                settings: {
			                    slidesToShow: 1,
			                    centerPadding: "30px",
			                    slidesToScroll: 1,
			                },
			            },
			            {
			                breakpoint: 319,
			                settings: {
			                    slidesToShow: 1.05,
			                    slidesToScroll: 1,
			                },
			            },
			        ],
			    });

			    /* if user coming from QR code start */

			    var mobfromQR = getCookie("Qrme");
			    if (mobfromQR != null && mobfromQR != "" && mobfromQR != undefined) {
			        var decryptmobile = decrypt(mobfromQR, pkd);
			        mobfromQR = decryptmobile.toString(CryptoJS.enc.Utf8);
			        $("#mobNumb").val(mobfromQR);
			    }

			    /* if user coming from QR code end */

			    // dynamic html for etb active
			    var exclisve = `<div class="Exclusive_Offers_padd">
			                                                  <div class="Exclusive_Offers_inner_1">
			                                                      <a href="https://www.bajajfinserv.in/store-locator" class="fordesktop" target="_blank"><img src="/sites/bajaj/Insta_Pod_2/images/StoreLocator_Desktop.png" loading="lazy" alt=""> </a>
			                                                      <a href="https://www.bajajfinserv.in/store-locator" class="formobile" target="_blank"><img src="/sites/bajaj/Insta_Pod_2/images/StoreLocator_Mobile.png" loading="lazy" alt=""> </a>
			                                                  </div>    
			                                              </div>`;

			    /* utm banner end */

			    /* if customer returning from payment portal */
			    if (msg != null && msg != "NA" && msg != undefined) {
			        respFromPayPage = msg;

			        $(".page1").hide();
			        $(".page18 .loader_screen_text").find("p").text("Loading...");
			        $(".page18").show();
			        apiRequestCreation("PaymentProcess");
			    } else {
			        $(".page1").show();
			        $(".page18").hide();
			    }

			    /* if Customer landing from another page start*/
			    var urlParams = new URLSearchParams(window.location.search);
			    var respFromKycPage, respFromPayPage, msgvalue, qrRes;

			    if (urlParams.has("msgs")) {
			        msgvalue = getUrlValue("msgs");
			        console.log("msgs::::" + msgvalue);
			        if (msgvalue != null) {
			            /*  if(msgvalue.includes(":"))	            						
			                                                          {
			                                                            msgvalue=msgvalue.replace(/ /g, "+"); 
			                                                            var index=msgvalue.lastIndexOf(":");  
			                                                            encryptresponse=msgvalue.substring(0,index);
			                                                          console.log("encryptresponse::::"+encryptresponse);
			                                                      } */
			            /*  else
			                                                     {
			                                                       msgvalue=msgvalue.replace(/ /g, "+"); 	     		
			                                                           encryptresponse=msgvalue;    
			                                                     }	 */
			            var decryptdata = decryptedvalue(msgvalue.replace(/ /g, "+"));
			            var parseData = JSON.parse(decryptdata);
			            $(".page1").find("#mobNumb").val(parseData.mobileno);
			        }
			    } else if (urlParams.has("qrres")) {
			        qrRes = getUrlValue("qrres");
			        console.log("qrRes :" + qrRes);

			        if (qrRes != undefined && qrRes != "" && qrRes != null) {
			            var decryptQrRes = decrypt(qrRes, pkd);
			            var responseFromQR = decryptQrRes.toString(CryptoJS.enc.Utf8);
			            console.log("responseFromQR :" + responseFromQR);

			            var qrme = getCookie("Qrme");

			            if (qrme != undefined && qrme != "" && qrme != null) {
			                setCookie("Zme", qrme);
			                $(".page1").hide();
			                otpVdSuccessManip(
			                    JSON.parse(responseFromQR),
			                    "/insta-emi-network-card-apply-online"
			                );
			            } else {
			                $(".page1_1").hide();
			                $(".page3").hide();
			                $(".page4").hide();
			                $(".page5").hide();
			                $(".page7").hide();
			                $(".page8").hide();
			                $(".page9").hide();
			                $(".page9_1").hide();
			                $(".page9_2").hide();
			                $(".page9_3").hide();
			                $(".page10").hide();
			                $(".page10_2").hide();
			                $(".page13").hide();
			                $(".page15").hide();
			                $(".page16").hide();
			                $(".page17").hide();
			                $(".page17_1").hide();
			                $(".page17_2").hide();
			                $(".page18").hide();
			                $(".page21").hide();
			                $(".page21_1").hide();
			                $(".page21_2").hide();
			                $(".page22").hide();
			                $(".page1").show();
			                console.log("Qrme cookie is expired");
			            }
			        }
			    } else if (urlParams.has("res")) {
			        respFromKycPage = getUrlValue("res");

			        if (
			            respFromKycPage != undefined &&
			            respFromKycPage != "" &&
			            respFromKycPage != null
			        ) {
			            $(".page1").hide();
			            $(".page18 .loader_screen_text").find("p").text("Loading...");
			            $(".page18").show();
			            apiRequestCreation("KycInProcess");
			        } else {
			            $(".page1").show();
			            $(".page18").hide();
			        }
			    } else if (urlParams.has("Params")) {
			        encData = getUrlValue("Params");

			        if (encData != undefined && encData != "" && encData != null) {
			            $(".page1").hide();
			            $(".page18 .loader_screen_text")
			                .find("p")
			                .text("Loading... Please wait.");
			            $(".page18").show();
			            apiRequestCreation("CustFromBFDL");
			        } else {
			            $(".page1").show();
			            $(".page18").hide();
			        }
			    } else if (urlParams.has("MandatePODRes")) {
			        resFromMandatePage = getUrlValue("MandatePODRes");
			        var onReload = getCookie("pRelInd");
			        if (
			            onReload != null &&
			            onReload != "null" &&
			            onReload != undefined &&
			            onReload != ""
			        ) {
			            if (onReload == "MS-10") {
			                $(".page1").hide();
			                $(".page18").hide();
			                $(".page10").show();
			                var updateAddress = getCookie("nAtbUp");
			                if (updateAddress == "true") {
			                    $(".shopNow").hide();
			                    $(".shopOnFull_1").hide();
			                } else {
			                    $(".shopNow").show();
			                    $(".shopOnFull_1").show();
			                }
			                var qrcheck;
			                var utmnewCookie = GetCookie("utm_new_cookie");
			                if (utmnewCookie != null && utmnewCookie != undefined) {
			                    utmnewCookie = JSON.parse(utmnewCookie);
			                    var qrCampaign = utmnewCookie["utm_campaign"];
			                    console.log("utm campaign value : " + qrCampaign);
			                    qrcheck = instaLinkUtmMapping(qrCampaign);
			                    if (qrcheck) {
			                        $(".Exclusive_Offers_slider").html(exclisve);
			                    }
			                }
			                var ccno = getCookie("iecn");
			                if (ccno != null && ccno != undefined && ccno != "") {
			                    var decryptccno = decrypt(ccno, pkd);
			                    ccno = decryptccno.toString(CryptoJS.enc.Utf8);
			                    ccno = ccno.replace(/.(?=.{4})/g, "X");
			                }
			                var card_display = getCookie("displayOnCard");
			                if (
			                    card_display != null &&
			                    card_display != undefined &&
			                    card_display != ""
			                ) {
			                    var decryptCustName = decrypt(card_display, pkd);
			                    card_display = decryptCustName.toString(CryptoJS.enc.Utf8);
			                }
			                var transactionDetail = getCookie("enctxn");
			                if (
			                    transactionDetail != null &&
			                    transactionDetail != undefined &&
			                    transactionDetail != ""
			                ) {
			                    var decryptTxn = decrypt(transactionDetail, pkd);
			                    transactionDetail = decryptTxn.toString(CryptoJS.enc.Utf8);
			                    transactionDetail = JSON.parse(transactionDetail);
			                }
			                $(".cardContant").find("strong").text(ccno);
			                $(".numberside").text(ccno);
			                $(".validfrom").text(validFrom);
			                $(".validtill").text(validTill);
			                $(".username").text(card_display);
			                var virtualcd = getCookie("VC");
			                if (virtualcd != null && virtualcd != undefined && virtualcd != "") {
			                    $(".onlyVcEtb").hide();
			                    $(".availLoanLmt").text("N/A");
			                } else {
			                    $(".availLoanLmt").text(
			                        "Rs. " + addCommaInAmount(transactionDetail.firstTransactionLimit)
			                    );
			                }
			                $(".totLoanLmt").text(
			                    "Rs. " + addCommaInAmount(transactionDetail.cardLimit)
			                );
			                var mandRefno = getCookie("mRefn");
			                if (
			                    mandRefno != null &&
			                    mandRefno != "null" &&
			                    mandRefno != undefined &&
			                    mandRefno != ""
			                ) {
			                    var decryptmandRefno = decrypt(mandRefno, pkd);
			                    mandRefno = decryptmandRefno.toString(CryptoJS.enc.Utf8);
			                    $(".MandRefno").text(mandRefno);
			                }
			                $(".MandDate").text(mandate);
			                var MandTxnRefNo = getCookie("mTxn");
			                if (
			                    MandTxnRefNo != null &&
			                    MandTxnRefNo != "null" &&
			                    MandTxnRefNo != undefined &&
			                    MandTxnRefNo != ""
			                ) {
			                    var decryptMandTxnRefNo = decrypt(MandTxnRefNo, pkd);
			                    MandTxnRefNo = decryptMandTxnRefNo.toString(CryptoJS.enc.Utf8);
			                    $(".MandTxnRefNo").text(MandTxnRefNo);
			                }
			                $(".Exclusive_Offers_slide").slick("refresh");
			                $("body").css("overflow-y", "auto");
			            } else if (onReload == "MF-10") {
			                $(".page1").hide();
			                $(".page18").hide();
			                $(".page10_2").show();

			                var ccno = getCookie("iecn");
			                if (ccno != null && ccno != undefined && ccno != "") {
			                    var decryptccno = decrypt(ccno, pkd);
			                    ccno = decryptccno.toString(CryptoJS.enc.Utf8);
			                    ccno = ccno.replace(/.(?=.{4})/g, "X");
			                }
			                var card_display = getCookie("displayOnCard");
			                if (
			                    card_display != null &&
			                    card_display != undefined &&
			                    card_display != ""
			                ) {
			                    var decryptCustName = decrypt(card_display, pkd);
			                    card_display = decryptCustName.toString(CryptoJS.enc.Utf8);
			                }
			                var transactionDetail = getCookie("enctxn");

			                if (
			                    transactionDetail != null &&
			                    transactionDetail != undefined &&
			                    transactionDetail != ""
			                ) {
			                    var decryptTxn = decrypt(transactionDetail, pkd);
			                    transactionDetail = decryptTxn.toString(CryptoJS.enc.Utf8);
			                    transactionDetail = JSON.parse(transactionDetail);
			                }

			                $(".cardContant").find("strong").text(ccno);
			                $(".numberside").text(ccno);
			                $(".validfrom").text(validFrom);
			                $(".validtill").text(validTill);
			                $(".username").text(card_display);

			                var virtualcd = getCookie("VC");
			                if (virtualcd != null && virtualcd != undefined && virtualcd != "") {
			                    $(".onlyVcEtb").hide();
			                    $(".availLoanLmt").text("N/A");
			                } else {
			                    $(".availLoanLmt").text(
			                        "Rs. " + addCommaInAmount(transactionDetail.firstTransactionLimit)
			                    );
			                }

			                $(".totLoanLmt").text(
			                    "Rs. " + addCommaInAmount(transactionDetail.cardLimit)
			                );

			                $(".Exclusive_Offers_slide").slick("refresh");
			                $("body").removeAttr("style");
			            }
			        } else if (
			            resFromMandatePage != undefined &&
			            resFromMandatePage != "" &&
			            resFromMandatePage != null
			        ) {
			            $(".page1").hide();
			            $(".page18 .loader_screen_text").find("p").text("Loading...");
			            $(".page18").show();
			            apiRequestCreation("MandateProcess");
			        } else {
			            $(".page1").show();
			            $(".page18").hide();
			        }
			    }
			    /* if Customer landing from another page end*/

			    /* reload scenario without any url appended start*/
			    var onReload = getCookie("pRelInd");
			    if (
			        onReload != null &&
			        onReload != "null" &&
			        onReload != undefined &&
			        onReload != ""
			    ) {
			        if (onReload == "MS-10") {
			            $(".page1").hide();
			            $(".page18").hide();
			            $(".page10").show();
			            var updateAddress = getCookie("nAtbUp");
			            if (updateAddress == "true") {
			                $(".shopNow").hide();
			                $(".shopOnFull_1").hide();
			            } else {
			                $(".shopNow").show();
			                $(".shopOnFull_1").show();
			            }
			            var qrcheck;
			            var utmnewCookie = GetCookie("utm_new_cookie");
			            if (utmnewCookie != null && utmnewCookie != undefined) {
			                utmnewCookie = JSON.parse(utmnewCookie);
			                var qrCampaign = utmnewCookie["utm_campaign"];
			                console.log("utm campaign value : " + qrCampaign);
			                qrcheck = instaLinkUtmMapping(qrCampaign);
			                if (qrcheck) {
			                    $(".Exclusive_Offers_slider").html(exclisve);
			                }
			            }
			            var ccno = getCookie("iecn");
			            if (ccno != null && ccno != undefined && ccno != "") {
			                var decryptccno = decrypt(ccno, pkd);
			                ccno = decryptccno.toString(CryptoJS.enc.Utf8);
			                ccno = ccno.replace(/.(?=.{4})/g, "X");
			            }
			            var card_display = getCookie("displayOnCard");
			            if (
			                card_display != null &&
			                card_display != undefined &&
			                card_display != ""
			            ) {
			                var decryptCustName = decrypt(card_display, pkd);
			                card_display = decryptCustName.toString(CryptoJS.enc.Utf8);
			            }
			            var transactionDetail = getCookie("enctxn");
			            if (
			                transactionDetail != null &&
			                transactionDetail != undefined &&
			                transactionDetail != ""
			            ) {
			                var decryptTxn = decrypt(transactionDetail, pkd);
			                transactionDetail = decryptTxn.toString(CryptoJS.enc.Utf8);
			                transactionDetail = JSON.parse(transactionDetail);
			            }
			            $(".cardContant").find("strong").text(ccno);
			            $(".numberside").text(ccno);
			            $(".validfrom").text(validFrom);
			            $(".validtill").text(validTill);
			            $(".username").text(card_display);
			            var virtualcd = getCookie("VC");
			            if (virtualcd != null && virtualcd != undefined && virtualcd != "") {
			                $(".onlyVcEtb").hide();
			                $(".availLoanLmt").text("N/A");
			            } else {
			                $(".availLoanLmt").text(
			                    "Rs. " + addCommaInAmount(transactionDetail.firstTransactionLimit)
			                );
			            }
			            $(".totLoanLmt").text(
			                "Rs. " + addCommaInAmount(transactionDetail.cardLimit)
			            );
			            var mandRefno = getCookie("mRefn");
			            if (
			                mandRefno != null &&
			                mandRefno != "null" &&
			                mandRefno != undefined &&
			                mandRefno != ""
			            ) {
			                var decryptmandRefno = decrypt(mandRefno, pkd);
			                mandRefno = decryptmandRefno.toString(CryptoJS.enc.Utf8);
			                $(".MandRefno").text(mandRefno);
			            }
			            $(".MandDate").text(mandate);
			            var MandTxnRefNo = getCookie("mTxn");
			            if (
			                MandTxnRefNo != null &&
			                MandTxnRefNo != "null" &&
			                MandTxnRefNo != undefined &&
			                MandTxnRefNo != ""
			            ) {
			                var decryptMandTxnRefNo = decrypt(MandTxnRefNo, pkd);
			                MandTxnRefNo = decryptMandTxnRefNo.toString(CryptoJS.enc.Utf8);
			                $(".MandTxnRefNo").text(MandTxnRefNo);
			            }
			            $(".Exclusive_Offers_slide").slick("refresh");
			            $("body").css("overflow-y", "auto");
			        } else if (onReload == "MF-10") {
			            $(".page1").hide();
			            $(".page18").hide();
			            $(".page10_2").show();

			            var ccno = getCookie("iecn");
			            if (ccno != null && ccno != undefined && ccno != "") {
			                var decryptccno = decrypt(ccno, pkd);
			                ccno = decryptccno.toString(CryptoJS.enc.Utf8);
			                ccno = ccno.replace(/.(?=.{4})/g, "X");
			            }
			            var card_display = getCookie("displayOnCard");
			            if (
			                card_display != null &&
			                card_display != undefined &&
			                card_display != ""
			            ) {
			                var decryptCustName = decrypt(card_display, pkd);
			                card_display = decryptCustName.toString(CryptoJS.enc.Utf8);
			            }
			            var transactionDetail = getCookie("enctxn");

			            if (
			                transactionDetail != null &&
			                transactionDetail != undefined &&
			                transactionDetail != ""
			            ) {
			                var decryptTxn = decrypt(transactionDetail, pkd);
			                transactionDetail = decryptTxn.toString(CryptoJS.enc.Utf8);
			                transactionDetail = JSON.parse(transactionDetail);
			            }

			            $(".cardContant").find("strong").text(ccno);
			            $(".numberside").text(ccno);
			            $(".validfrom").text(validFrom);
			            $(".validtill").text(validTill);
			            $(".username").text(card_display);
			            var virtualcd = getCookie("VC");
			            if (virtualcd != null && virtualcd != undefined && virtualcd != "") {
			                $(".onlyVcEtb").hide();
			                $(".availLoanLmt").text("N/A");
			            } else {
			                $(".availLoanLmt").text(
			                    "Rs. " + addCommaInAmount(transactionDetail.firstTransactionLimit)
			                );
			            }

			            $(".totLoanLmt").text(
			                "Rs. " + addCommaInAmount(transactionDetail.cardLimit)
			            );

			            $(".Exclusive_Offers_slide").slick("refresh");
			            $("body").removeAttr("style");
			        }
			    }
			    /* reload scenario without any url appended end*/

			    //on card nudge page1
			    $(function () {
			        count = 0;
			        wordsArray = [
			            "Easy online & offline shopping",
			            "Instant approval & activation",
			        ];
			        setInterval(function () {
			            count++;

			            $(".greenLable i").fadeOut(200, function () {
			                $(this)
			                    .text(wordsArray[count % wordsArray.length])
			                    .fadeIn(200);
			            });
			        }, 3000);
			    });

			    // for faq open
			    $("body").on("click", ".faq_card h3", function () {
			        $(this).toggleClass("active");
			        $(this).siblings("div").slideToggle(200);

			        $(this).parent().siblings().children("h3").removeClass("active");
			        $(this).parent().siblings().children("div").slideUp(200);
			    });

			    $("body").on("click", ".faqPart > h2", function () {
			        $(this).toggleClass("active");
			        $(this).siblings(".faqaccord_box").slideToggle(200);

			        var faqOfset = $(this).parent().offset().top;
			        $("html, body").animate(
			            {
			                scrollTop: faqOfset,
			            },
			            200
			        );
			    });

			    if ($(window).width() < 992) {
			        $(".page13 .faqPart").insertAfter(".page13 .insertAfterFaqInMobile");
			        $(".page10_2 .retryoption").insertAfter(".page10_2 .Card_Details");
			        $(".disclaimers_part").insertAfter("#prodetails_1 .detailsPart");
			    }

			    //input lable

			    $(".form-group select").change(function () {
			        $(this).siblings("label").addClass("active");
			        var th = $(this);
			    });

			    $(".form-group input,.form-group textarea").each(function () {
			        $(this).on("focus", function () {
			            $(this).parents(".innrfildlte").addClass("active");
			            if ($(this).val() == "") {
			                $(this).siblings("label").addClass("active");
			            }
			        });
			        if ($(this).val() != "") {
			            $(this).siblings("label").addClass("active");
			        }
			        $(this).on("blur", function () {
			            $(this).parents(".innrfildlte").removeClass("active");
			            if ($(this).val() == "") {
			                $(this).siblings("label").removeClass("active");
			            }
			            var th = $(this);
			        });
			    });

			    /*  	$("#prodetails_1 .innrfildlte input,#addressform .innrfildlte input").focus(function () {
			                   var offSetInput = $(this).offset().top - 25;
			                   $("html, body").animate({ scrollTop: offSetInput }, 200);
			                 });   */

			    /*$('#addressform .innrfildlte input').blur(function () {
			          var frmid = $(this).parents("form").attr("id");
			          var topofferr = 0;
			          var inputCheck = 0;
			  
			  
			          var midclass = $(this).parents(".detailsPart").hasClass("relation_status");
			          var midclassname = "address_status";
			          if (midclass) {
			              midclassname = "relation_status";
			          }
			  
			          $("#" + frmid + " ." + midclassname + " .errormsg").each(function () {
			              if ($(this).css("display") == "block") {
			                  if (topofferr == 0) {
			                      topofferr = $(this).offset().top;
			                  }
			              }
			          });
			  
			          $("#" + frmid + " ." + midclassname + " .innrfildlte input").each(function () {
			              if ($(this).val() == "") {
			                  inputCheck = 1;
			              }
			          });
			          console.log("topofferr=" + topofferr);
			          console.log("inputcheck=" + inputCheck);
			  
			          if (topofferr == 0 && !inputCheck == 1) {
			              $("#addressform .btnstyl").prop('disabled', false);
			          } else {
			              $("#addressform .btnstyl").prop('disabled', true);
			          }
			  
			      });*/

			    $("#addressform .btnstyl").click(function (e) {
			        e.preventDefault();
			        var frmid = $(this).parents("form").attr("id");

			        setTimeout(function () {
			            var topofferr = toperrrorcheck(frmid);

			            if (topofferr == 0) {
			                $(".page7").hide();
			                //$('.page8').show();
			                count3minut();
			                $("html, body").animate({ scrollTop: 0 }, 200);
			            } else {
			                $("html, body").animate({ scrollTop: topofferr - 50 }, 200);
			            }
			        }, 300);
			    });

			    // for form validation
			    function toperrrorcheck(frmid) {
			        var topofferr = 0;
			        $("#" + frmid + " .errormsg").each(function () {
			            if ($(this).css("display") == "block") {
			                if (topofferr == 0) {
			                    topofferr = $(this).offset().top;
			                }
			            }
			        });
			        return topofferr;
			    }

			    function fildValidation(th, VDclass, ErrMSG) {
			        var timer = null;
			        var self = $(th);
			        if (ErrMSG) {
			            $(th).siblings(".errormsg").text(ErrMSG);
			        }
			    }
			    $(".otpVD").keyup(function (e) {
			        var mo = $(this).val();
			        if (mo.length == 6) {
			            $(this).blur();
			            $("#cardOtpF2 .btnstyl").trigger("click");
			            $("body").removeAttr("style");
			        }                
			    });
			    $(".otpVD").keydown(function (event) {    
			        k = event.which;
			        if ((k >= 48 && k <= 57) || (k >= 96 && k <= 105) || k == 8 || k == 9) {
			            if ($(this).val().length == 10) {
			                if (k == 8 || k == 9) {
			                    return true;
			                } else {
			                    event.preventDefault();
			                    return false;
			                }
			            }
			        } else {
			            event.preventDefault();
			            return false;
			        }
			    });

			    $(".PanVD").on("keypress", function (event) {
			        if (event.keyCode != 32) {
			            var regex = new RegExp("^[a-zA-Z0-9]+$");
			            var key = String.fromCharCode(
			                !event.charCode ? event.which : event.charCode
			            );
			            if (!regex.test(key)) {
			                event.preventDefault();
			                return false;
			            }
			        }
			    });

			    $(".otpVD").keypress(function (e) {
			        var mo = $(this).val();
			        if (mo.length > 6) {
			            $(this).val(mo.substr(0, 6));
			        }
			        if (e.keyCode != 13) {
			            if (mo.length > 5) {
			                e.preventDefault();
			                return false;
			            }
			        }

			        var str1 = 0;
			        str1 = mo;
			        str1 = str1.replace(/[^1]/g, "");
			        if ($(window).width() > 1199) {
			            if (str1 == "1") {
			                $(".a_otpPart .innrfildlte input").css("letter-spacing", "36px");
			            } else if (str1 == "11") {
			                $(".a_otpPart .innrfildlte input").css("letter-spacing", "36px");
			            } else if (str1 == "111") {
			                $(".a_otpPart .innrfildlte input").css("letter-spacing", "38px");
			            } else if (str1 == "1111") {
			                $(".a_otpPart .innrfildlte input").css("letter-spacing", "39px");
			            } else if (str1 == "11111") {
			                $(".a_otpPart .innrfildlte input").css("letter-spacing", "39px");
			            } else {
			                $(".a_otpPart .innrfildlte input").css("letter-spacing", "34px");
			            }
			        } else if ($(window).width() <= 1199 && $(window).width() >= 992) {
			            if (str1 == "1") {
			                $(".a_otpPart .innrfildlte input").css("letter-spacing", "28px");
			            } else if (str1 == "11") {
			                $(".a_otpPart .innrfildlte input").css("letter-spacing", "28px");
			            } else if (str1 == "111") {
			                $(".a_otpPart .innrfildlte input").css("letter-spacing", "29px");
			            } else if (str1 == "1111") {
			                $(".a_otpPart .innrfildlte input").css("letter-spacing", "29px");
			            } else if (str1 == "11111") {
			                $(".a_otpPart .innrfildlte input").css("letter-spacing", "30px");
			            } else {
			                $(".a_otpPart .innrfildlte input").css("letter-spacing", "27px");
			            }
			        } else {
			            if (str1 == "1") {
			                $(".a_otpPart .innrfildlte input").css("letter-spacing", "31px");
			            } else if (str1 == "11") {
			                $(".a_otpPart .innrfildlte input").css("letter-spacing", "32px");
			            } else if (str1 == "111") {
			                $(".a_otpPart .innrfildlte input").css("letter-spacing", "34px");
			            } else if (str1 == "1111") {
			                $(".a_otpPart .innrfildlte input").css("letter-spacing", "34px");
			            } else if (str1 == "11111") {
			                $(".a_otpPart .innrfildlte input").css("letter-spacing", "35px");
			            } else {
			                $(".a_otpPart .innrfildlte input").css("letter-spacing", "31px");
			            }
			        }
			    });
			    $(".FullNameVD").on("keypress", function (event) {
			        if (event.keyCode != 32) {
			            var regex = new RegExp("^[a-zA-Z]+$");
			            var key = String.fromCharCode(
			                !event.charCode ? event.which : event.charCode
			            );
			            if (!regex.test(key)) {
			                event.preventDefault();
			                return false;
			            }
			        }
			    });

			    $(".otpVD").on("keypress", function (event) {
			        if (event.keyCode != 32) {
			            var regex = new RegExp("^[0-9]+$");
			            var key = String.fromCharCode(
			                !event.charCode ? event.which : event.charCode
			            );
			            if (!regex.test(key)) {
			                event.preventDefault();
			                return false;
			            }
			        }
			    });
			    $(".Subbutton").click(function () {
			        var parent = $(this).parents("form").attr("id");
			        if ($(this).attr("id") == "offerForm") {
			            parent = "offerForm";
			        }
			        var error = 0;
			        $("#" + parent + " " + ".form-group input").each(function () {
			            if (!$(this).hasClass("nomandetory")) {
			                if (!$(this).attr("disabled")) {
			                    if ($(this).val() == "") {
			                        $(this).siblings(".errormsg").show();
			                        error++;
			                        fildValidation(this, "VDfalse");
			                    } else {
			                        if ($(this).hasClass("otpVD")) {
			                            var value = $(this).val();
			                            if (value.length < 6 || value.length > 6) {
			                                $(this).siblings(".errormsg").show();
			                                fildValidation(this, "Try again with correct OTP");
			                                $(this).siblings(".a_optlinMain").addClass("invalidOTP");
			                            } else {
			                                $(this).siblings(".errormsg").hide();
			                                $(this).siblings(".a_optlinMain").removeClass("invalidOTP");
			                            }
			                        } else if ($(this).hasClass("FullNameVD")) {
			                            var sval = $(this).val().trim();
			                            sval = sval.replace(/\s\s+/g, " ");
			                            $(this).val(sval);
			                            var checkequal = sval.split(" ");
			                            var [fname, mname, lname] = checkequal;
			                            var fname_1 = "";
			                            var fname_2 = "";
			                            var mname_1 = "";
			                            var mname_2 = "";
			                            var lname_1 = "";
			                            var lname_2 = "";
			                            if (fname) {
			                                fname_1 = fname.substr(0, 1);
			                                fname_2 = fname.substr(1, 2);
			                                fname = fname.toLowerCase();
			                            }
			                            if (mname) {
			                                mname_1 = mname.substr(0, 1);
			                                mname_2 = mname.substr(1, 2);
			                                mname = mname.toLowerCase();
			                            }
			                            if (lname) {
			                                lname_1 = lname.substr(0, 1);
			                                lname_2 = lname.substr(1, 2);
			                                lname = lname.toLowerCase();
			                            }
			                            if (!/^[a-zA-Z .]*$/g.test($(this).val())) {
			                                $(this).siblings(".errormsg").show();
			                                fildValidation(this, "VDfalse", "Only alphabets are allowed");
			                            } else if ($(this).val().split(" ").length == 1) {
			                                $(this).siblings(".errormsg").show();
			                                fildValidation(this, "VDfalse", "Enter valid full name");
			                            } else if (
			                                fname.length == 1 &&
			                                mname.length == 1 &&
			                                lname.length == 1
			                            ) {
			                                $(this).siblings(".errormsg").show();
			                                fildValidation(this, "VDfalse", "Enter valid full name");
			                            } else if (
			                                (fname.length == 2 && mname.length == 2) ||
			                                (fname.length == 2 && mname.length == 2 && lname.length == 2)
			                            ) {
			                                if (
			                                    (fname_1 == fname_2 && mname_1 == mname_2) ||
			                                    (fname_1 == fname_2 &&
			                                        mname_1 == mname_2 &&
			                                        lname_1 == lname_2)
			                                ) {
			                                    $(this).siblings(".errormsg").show();
			                                    fildValidation(this, "VDfalse", "Enter valid full name");
			                                }
			                                $(this).siblings(".errormsg").show();
			                                fildValidation(this, "VDfalse", "Enter valid full name");
			                            } else if (fname == mname) {
			                                $(this).siblings(".errormsg").show();
			                                fildValidation(
			                                    this,
			                                    "VDfalse",
			                                    "First Name and Middle Name cannot be same"
			                                );
			                            } else if (fname == lname) {
			                                $(this).siblings(".errormsg").show();
			                                fildValidation(
			                                    this,
			                                    "VDfalse",
			                                    "First Name & Last Name cannot be same"
			                                );
			                            } else if (mname == lname) {
			                                $(this).siblings(".errormsg").show();
			                                fildValidation(
			                                    this,
			                                    "VDfalse",
			                                    "Middle Name and last name cannot be same"
			                                );
			                            } else {
			                                if ($(this).val().split(" ").length > 3) {
			                                    $(this).siblings(".errormsg").show();
			                                    fildValidation(
			                                        this,
			                                        "VDfalse",
			                                        "More than 2 spaces are not allowed"
			                                    );
			                                } else {
			                                    $(this).siblings(".errormsg").hide();
			                                    fildValidation(this);
			                                }
			                            }
			                        } else if ($(this).hasClass("mobileVD")) {
			                            var value = $(this).val();
			                            if (!/^[0-9\-]+$/.test($(this).val())) {
			                                $(this).siblings(".errormsg").show();
			                                error++;
			                                fildValidation(
			                                    this,
			                                    "VDfalse",
			                                    "Enter your 10-digit mobile number"
			                                );
			                            } else if (value.length < 10 || value.length > 10) {
			                                $(this).siblings(".errormsg").show();
			                                error++;
			                                fildValidation(
			                                    this,
			                                    "VDfalse",
			                                    "Enter your 10-digit mobile number"
			                                );
			                            } else {
			                                if (value.indexOf(".") > -1) {
			                                    $(this).siblings(".errormsg").show();
			                                    error++;
			                                    fildValidation(
			                                        this,
			                                        "VDfalse",
			                                        "Enter your 10-digit mobile number"
			                                    );
			                                } else if (
			                                    value.substr(0, 1) == 9 ||
			                                    value.substr(0, 1) == 8 ||
			                                    value.substr(0, 1) == 7 ||
			                                    value.substr(0, 1) == 6
			                                ) {
			                                    $(this).siblings(".errormsg").hide();
			                                    if (error > 0) {
			                                        error--;
			                                    }
			                                    fildValidation(this, "VDtrue");
			                                } else {
			                                    $(this).siblings(".errormsg").show();
			                                    error++;
			                                    fildValidation(
			                                        this,
			                                        "VDfalse",
			                                        "Mobile number should start with 9, 8, 7 or 6"
			                                    );
			                                }
			                            }
			                        } else if ($(this).hasClass("AddressVD")) {
			                            var value = $(this).val();
			                            if (/[`~<>[\]\|{}()=_+]/g.test($(this).val())) {
			                                $(this).siblings(".errormsg").show();
			                                fildValidation(this, "<>?=+-_^`~  not allowed");
			                            } else {
			                                if (parent == "addressform") {
			                                    var add1 = $("#address_1").val();
			                                    add1 = add1.toLowerCase().replace(/[^A-Za-z0-9]/g, "");
			                                    if (add1.length < 5) {
			                                        $("#address_1")
			                                            .siblings(".errormsg")
			                                            .show()
			                                            .text("Add your complete flat/house no.");
			                                    } else {
			                                        $(this).siblings(".errormsg").hide();
			                                        fildValidation(this);
			                                    }
			                                    var add2 = $("#address_2").val();
			                                    add2 = add2.toLowerCase().replace(/[^A-Za-z0-9]/g, "");
			                                    var finaladdress = add1 + add2;
			                                    if (finaladdress.length < 20) {
			                                        $("#address_2")
			                                            .siblings(".errormsg")
			                                            .show()
			                                            .text("Add area and nearby landmark details");
			                                    } else {
			                                        $(this).siblings(".errormsg").hide();
			                                        fildValidation(this);
			                                    }
			                                } else {
			                                    $(this).siblings(".errormsg").hide();
			                                    fildValidation(this);
			                                }
			                            }
			                        } else if ($(this).hasClass("PinCodeVD")) {
			                            var value = $(this).val();
			                            if (!/^[0-9]+$/.test($(this).val())) {
			                                $(this).siblings(".errormsg").show();
			                                fildValidation(this, "VDfalse", "Enter valid PIN code");
			                            } else {
			                                if ($(this).val().length == 6) {
			                                    if (value.substr(0, 1) == 0) {
			                                        $(this).siblings(".errormsg").show();
			                                        fildValidation(this, "VDfalse", "Enter valid PIN code");
			                                    } else if (
			                                        value.substr(5, 1) == 0 &&
			                                        value.substr(4, 1) == 0 &&
			                                        value.substr(3, 1) == 0
			                                    ) {
			                                        $(this).siblings(".errormsg").show();
			                                        fildValidation(this, "VDfalse", "Enter valid PIN code");
			                                    } else {
			                                        $(this).siblings(".errormsg").hide();
			                                    }
			                                } else {
			                                    $(this).siblings(".errormsg").show();
			                                    fildValidation(this, "VDfalse", "Enter valid PIN code");
			                                }
			                            }
			                        } else if ($(this).hasClass("PanVD")) {
			                            var value = $(this).val();
			                            value = value.toUpperCase();
			                            $(this).val(value);
			                            if (value.length < 10 || value.length > 10) {
			                                $(this).siblings(".errormsg").show();
			                                fildValidation(
			                                    this,
			                                    "VDtrue",
			                                    "PAN number should be of 10 characters"
			                                );
			                                error++;
			                            }
			                            if (
			                                !/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/.test($(this).val())
			                            ) {
			                                $(this).siblings(".errormsg").show();
			                                fildValidation(
			                                    this,
			                                    "VDtrue",
			                                    "Enter valid PAN number; eg: ABCHE9999A"
			                                );
			                            } else {
			                                if ($(this).val().substr(3, 1) == "P") {
			                                    $(this).siblings(".errormsg").hide();
			                                    fildValidation(this);
			                                } else {
			                                    $(this).siblings(".errormsg").show();
			                                    fildValidation(
			                                        this,
			                                        "VDtrue",
			                                        "Enter valid PAN number; eg: ABCPC9999A"
			                                    );
			                                }
			                            }
			                        } else if ($(this).hasClass("dobVD")) {
			                            var a = $(this).val();
			                            var str = a.split("/");
			                            var a_year = str[2];
			                            var a_month = str[1];
			                            var a_day = str[0];
			                            var age = getAge(a_year + "/" + a_month + "/" + a_day);

			                            var filter =
			                                /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;
			                            if (filter.test(a)) {
			                                if (age < 21) {
			                                    fildValidation(
			                                        this,
			                                        "VDfalse",
			                                        "You need to be between 21 and 65 years of age to be eligible"
			                                    );
			                                } else if (age > 64) {
			                                    fildValidation(
			                                        this,
			                                        "VDfalse",
			                                        "You need to be between 21 and 65 years of age to be eligible"
			                                    );
			                                } else {
			                                    $(this).siblings(".errormsg").hide();
			                                    fildValidation(this, "VDtrue");
			                                }
			                            } else {
			                                $(this).siblings(".errormsg").show();
			                                fildValidation(this, "VDfalse", "Enter valid date of birth");
			                            }
			                        }
			                    }
			                }
			            }
			        });
			        $("#" + parent + " " + "input[type='checkbox']").each(function () {
			            if (!$(this).hasClass("nomandetory")) {
			                if (!$(this).attr("disabled")) {
			                    if (!$(this).is(":checked")) {
			                        $(this).parents("p").siblings(".errormsg").show();
			                        $(this).parents("label").siblings(".errormsg").show();
			                        fildValidation(this);
			                    } else {
			                        $(this).parents("p").siblings(".errormsg").hide();
			                        $(this).parents("label").siblings(".errormsg").hide();
			                        fildValidation(this);
			                    }
			                }
			            } else {
			            }
			        });
			    });

			    function validornot(th) {
			        if (!th.hasClass("nomandetory")) {
			            if (th.siblings(".errormsg").css("display") == "none") {
			                th.parents(".innrfildlte").addClass("valid").removeClass("invalid");
			                th.parents(".innrfildlte").removeClass("field-blink");
			            } else {
			                th.parents(".innrfildlte").removeClass("valid").addClass("invalid");
			                th.parents(".innrfildlte").addClass("field-blink");
			            }
			        }
			    }
			    $(".innrfildlte input").blur(function () {
			        var th = $(this);
			        setTimeout(function () {
			            validornot(th);
			        }, 300);
			    });
			    $(".innrfildlte select").change(function () {
			        var th = $(this);
			        setTimeout(function () {
			            validornot(th);
			        }, 300);
			    });

			    $(".innrfildlte input").focus(function () {
			        var scrollTop = $(this).offset().top;
			        $("html, body").animate(
			            {
			                scrollTop: scrollTop - 100,
			            },
			            "slow"
			        );
			    });

			    $(".innrfildlte").click(function () {
			        var scrollTop = $(this).offset().top;
			        $("html, body").animate(
			            {
			                scrollTop: scrollTop - 100,
			            },
			            "slow"
			        );
			    });

			    function getAge(dateString) {
			        var today = new Date();
			        var birthDate = new Date(dateString);
			        var age = today.getFullYear() - birthDate.getFullYear();
			        var m = today.getMonth() - birthDate.getMonth();
			        /*if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			                age--;
			            }*/

			        if (
			            (m === 0 && today.getDate() < birthDate.getDate()) ||
			            today.getDate() === birthDate.getDate()
			        ) {
			            age--;
			        }
			        return age;
			    }
			    $(".form-group input").blur(function () {
			        if (!$(this).hasClass("nomandetory")) {
			            if (!$(this).attr("disabled")) {
			                if ($(this).val() == "") {
			                    if ($(this).hasClass("datepickerVD")) {
			                    } else if ($(this).hasClass("otpVD")) {
			                        $(this).siblings(".errormsg").show();
			                        fildValidation(this, "VDfalse", "Enter valid OTP");
			                        $(this).siblings(".a_optlinMain").addClass("invalidOTP");
			                    } else {
			                        $(this).siblings(".errormsg").show();
			                        fildValidation(this, "VDfalse");
			                    }
			                } else {
			                    if ($(this).hasClass("otpVD")) {
			                        var value = $(this).val();
			                        if (value.length < 6 || value.length > 6) {
			                            $(this).siblings(".errormsg").show();
			                            fildValidation(this, "VDfalse", "Try again with correct OTP");
			                            $(this).siblings(".a_optlinMain").addClass("invalidOTP");
			                        } else {
			                            $(this).siblings(".errormsg").hide();
			                            $(this).siblings(".a_optlinMain").removeClass("invalidOTP");
			                        }
			                    } else if ($(this).hasClass("FullNameVD")) {
			                        var sval = $(this).val().trim();
			                        sval = sval.replace(/\s\s+/g, " ");
			                        sval = sval.toUpperCase();
			                        $(this).val(sval);
			                        var checkequal = sval.split(" ");
			                        var [fname, mname, lname] = checkequal;
			                        var fname_1 = "";
			                        var fname_2 = "";
			                        var mname_1 = "";
			                        var mname_2 = "";
			                        var lname_1 = "";
			                        var lname_2 = "";
			                        if (fname) {
			                            fname_1 = fname.substr(0, 1);
			                            fname_2 = fname.substr(1, 2);
			                            fname = fname.toLowerCase();
			                        }
			                        if (mname) {
			                            mname_1 = mname.substr(0, 1);
			                            mname_2 = mname.substr(1, 2);
			                            mname = mname.toLowerCase();
			                        }
			                        if (lname) {
			                            lname_1 = lname.substr(0, 1);
			                            lname_2 = lname.substr(1, 2);
			                            lname = lname.toLowerCase();
			                        }
			                        if (!/^[a-zA-Z ]*$/g.test($(this).val())) {
			                            $(this).siblings(".errormsg").show();
			                            fildValidation(this, "VDfalse", "Only alphabets are allowed");
			                        } else if ($(this).val().split(" ").length == 1) {
			                            $(this).siblings(".errormsg").show();
			                            fildValidation(this, "VDfalse", "Enter valid full name");
			                        } else if (
			                            fname.length == 1 &&
			                            mname.length == 1 &&
			                            lname.length == 1
			                        ) {
			                            $(this).siblings(".errormsg").show();
			                            fildValidation(this, "VDfalse", "Enter valid full name");
			                        } else if (
			                            fname.length == 2 &&
			                            mname.length == 2 &&
			                            lname.length == 2
			                        ) {
			                            if (
			                                fname_1 == fname_2 &&
			                                mname_1 == mname_2 &&
			                                lname_1 == lname_2
			                            ) {
			                                $(this).siblings(".errormsg").show();
			                                fildValidation(this, "VDfalse", "Enter valid full name");
			                            }
			                        } else if (fname == mname) {
			                            $(this).siblings(".errormsg").show();
			                            fildValidation(
			                                this,
			                                "VDfalse",
			                                "First Name and Middle Name cannot be same"
			                            );
			                        } else if (fname == lname) {
			                            $(this).siblings(".errormsg").show();
			                            fildValidation(
			                                this,
			                                "VDfalse",
			                                "First Name & Last Name cannot be same"
			                            );
			                        } else if (mname == lname) {
			                            $(this).siblings(".errormsg").show();
			                            fildValidation(
			                                this,
			                                "VDfalse",
			                                "Middle Name and last name cannot be same"
			                            );
			                        } else {
			                            if ($(this).val().split(" ").length > 3) {
			                                $(this).siblings(".errormsg").show();
			                                fildValidation(
			                                    this,
			                                    "VDfalse",
			                                    "More than 2 spaces are not allowed"
			                                );
			                            } else {
			                                $(this).siblings(".errormsg").hide();
			                                fildValidation(this);
			                            }
			                        }
			                    } else if ($(this).hasClass("mobileVD")) {
			                        var value = $(this).val();
			                        if (!/^[0-9\-]+$/.test($(this).val())) {
			                            $(this).siblings(".errormsg").show();
			                            fildValidation(
			                                this,
			                                "VDfalse",
			                                "Enter your 10-digit mobile number"
			                            );
			                        } else if (value.length < 10 || value.length > 10) {
			                            $(this).siblings(".errormsg").show();
			                            fildValidation(
			                                this,
			                                "VDfalse",
			                                "Enter your 10-digit mobile number"
			                            );
			                        } else {
			                            if (value.indexOf(".") > -1) {
			                                $(this).siblings(".errormsg").show();
			                                fildValidation(
			                                    this,
			                                    "VDfalse",
			                                    "Enter your 10-digit mobile number"
			                                );
			                            } else if (
			                                value.substr(0, 1) == 9 ||
			                                value.substr(0, 1) == 8 ||
			                                value.substr(0, 1) == 7 ||
			                                value.substr(0, 1) == 6
			                            ) {
			                                $(this).siblings(".errormsg").hide();
			                                fildValidation(this, "VDtrue");
			                            } else if (!/^[0-9\-]+$/.test($(this).val())) {
			                                $(this).siblings(".errormsg").show();
			                                fildValidation(
			                                    this,
			                                    "VDfalse",
			                                    "Enter your 10-digit mobile number"
			                                );
			                            } else {
			                                $(this).siblings(".errormsg").show();
			                                fildValidation(
			                                    this,
			                                    "VDfalse",
			                                    "Mobile number should start with 9, 8, 7 or 6"
			                                );
			                            }
			                        }
			                    } else if ($(this).hasClass("AddressVD")) {
			                        var value = $(this).val();
			                        if (/[`~<>[\]\|{}()=_+]/g.test($(this).val())) {
			                            $(this).siblings(".errormsg").show();
			                            fildValidation(this, "<>?=+-_^`~  not allowed");
			                        } else {
			                            $(this).siblings(".errormsg").hide();
			                            fildValidation(this);
			                        }
			                    } else if ($(this).hasClass("PinCodeVD")) {
			                        var value = $(this).val();
			                        if (!/^[0-9]+$/.test($(this).val())) {
			                            $(this).siblings(".errormsg").show();
			                            fildValidation(this, "VDfalse", "Enter valid PIN code");
			                        } else {
			                            if ($(this).val().length == 6) {
			                                if (value.substr(0, 1) == 0) {
			                                    $(this).siblings(".errormsg").show();
			                                    fildValidation(this, "VDfalse", "Enter valid PIN code");
			                                } else if (
			                                    value.substr(5, 1) == 0 &&
			                                    value.substr(4, 1) == 0 &&
			                                    value.substr(3, 1) == 0
			                                ) {
			                                    $(this).siblings(".errormsg").show();
			                                    fildValidation(this, "VDfalse", "Enter valid PIN code");
			                                } else {
			                                    $(this).siblings(".errormsg").hide();
			                                }
			                            } else {
			                                $(this).siblings(".errormsg").show();
			                                fildValidation(this, "VDfalse", "Enter valid PIN code");
			                            }
			                        }
			                    } else if ($(this).hasClass("PanVD")) {
			                        var value = $(this).val();
			                        value = value.toUpperCase();
			                        $(this).val(value);
			                        if (value.length < 10 || value.length > 10) {
			                            $(this).siblings(".errormsg").show();
			                            fildValidation(
			                                this,
			                                "VDtrue",
			                                "PAN number should be of 10 characters"
			                            );
			                        }
			                        if (
			                            !/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/.test($(this).val())
			                        ) {
			                            $(this).siblings(".errormsg").show();
			                            fildValidation(
			                                this,
			                                "VDtrue",
			                                "Enter valid PAN number; eg: ABCHE9999A"
			                            );
			                        } else {
			                            if ($(this).val().substr(3, 1) == "P") {
			                                $(this).siblings(".errormsg").hide();
			                                fildValidation(this);
			                            } else {
			                                $(this).siblings(".errormsg").show();
			                                fildValidation(
			                                    this,
			                                    "VDtrue",
			                                    "Enter valid PAN number; eg: ABCPC9999A"
			                                );
			                            }
			                        }
			                    } else if ($(this).hasClass("dobVD")) {
			                        var a = $(this).val();
			                        $(this).siblings("input").val(a);
			                        var str = a.split("/");
			                        var a_year = str[2];
			                        var a_month = str[1];
			                        var a_day = str[0];
			                        var age = getAge(a_year + "/" + a_month + "/" + a_day);

			                        var filter =
			                            /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;
			                        if (filter.test(a)) {
			                            if (age < 21) {
			                                $(this).siblings(".errormsg").show();
			                                fildValidation(
			                                    this,
			                                    "VDfalse",
			                                    "You need to be between 21 and 65 years of age to be eligible"
			                                );
			                            } else if (age > 64) {
			                                $(this).siblings(".errormsg").show();
			                                fildValidation(
			                                    this,
			                                    "VDfalse",
			                                    "You need to be between 21 and 65 years of age to be eligible"
			                                );
			                            } else {
			                                $(this).siblings(".errormsg").hide();
			                                fildValidation(this, "VDtrue");
			                            }
			                        } else {
			                            $(this).siblings(".errormsg").show();
			                            fildValidation(this, "VDfalse", "Enter valid date of birth");
			                        }
			                    }
			                }
			            }
			        }
			    });
			    // for check checkbox
			    $(".checkConfirm label input").change(function () {
			        if (!$(this).hasClass("nomandetory")) {
			            if (!$(this).attr("disabled")) {
			                if (!$(this).is(":checked")) {
			                    $(this).parents("label").siblings(".errormsg").show();
			                    fildValidation(this);
			                } else {
			                    $(this).parents("label").siblings(".errormsg").hide();
			                    fildValidation(this);
			                }
			            }
			        }
			    });
			    //dobVD
			    $(".dobVD").keyup(function (e) {
			        var mo = $(this).val();
			        if (mo.length > 10) {
			            $(this).val(mo.substr(0, 10));
			        }
			        if (mo.length == 10) {
			            //$(this).blur();
			        }
			        if (e.keyCode != 8) {
			            if ($(this).val().length == 2) {
			                $(this).val($(this).val() + "/");
			            } else if ($(this).val().length == 5) {
			                $(this).val($(this).val() + "/");
			            }
			        }
			    });
			    $(".dobVD").keydown(function (event) {
			        k = event.which;
			        if ((k >= 48 && k <= 57) || (k >= 96 && k <= 105) || k == 8 || k == 9) {
			            if (
			                $(this).val().length == 2 ||
			                $(this).val().length == 5 ||
			                $(this).val().length == 10
			            ) {
			                if (k == 8 || k == 9) {
			                    return true;
			                } else {
			                    event.preventDefault();
			                    return false;
			                }
			            }
			        } else {
			            event.preventDefault();
			            return false;
			        }
			    });
			    $(".dobVD").keypress(function (event) {
			        if (event.keyCode != 32) {
			            var regex = new RegExp("^[0-9]+$");
			            var key = String.fromCharCode(
			                !event.charCode ? event.which : event.charCode
			            );
			            if (!regex.test(key)) {
			                event.preventDefault();
			                return false;
			            }
			        }
			    });
			    $(".mobileVD").keyup(function (e) {
			        var mo = $(this).val();
			        if (mo.length > 10) {
			            $(this).val(mo.substr(0, 10));
			        }
			        mo = mo.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
			        $(this).val(mo);
			    });
			    if ($(window).width() < 1025) {
			        $(".mobileVD").prop("type", "number");
			    }
			    $(".mobileVD").keypress(function (event) {
			        if (event.keyCode != 32) {
			            var regex = new RegExp("^[0-9]+$");
			            var key = String.fromCharCode(
			                !event.charCode ? event.which : event.charCode
			            );
			            if (!regex.test(key)) {
			                event.preventDefault();
			                return false;
			            }
			        }
			    });
			    $(".mobileVD").keydown(function (event) {
			        k = event.which;
			        var mo = $(this).val();
			        mo = mo.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
			        $(this).val(mo);
			        if ((k >= 48 && k <= 57) || (k >= 96 && k <= 105) || k == 8 || k == 9) {
			            if ($(this).val().length == 10) {
			                if (k == 8 || k == 9) {
			                    return true;
			                } else {
			                    event.preventDefault();
			                    return false;
			                }
			            }
			        } else {
			            event.preventDefault();
			            return false;
			        }
			    });

			    $(".PinCodeVD").keyup(function (e) {
			        var mo = $(this).val();
			        if (mo.length > 6) {
			            $(this).val(mo.substr(0, 6));
			        }
			    });
			    $(".PinCodeVD").keypress(function (e) {
			        var mo = $(this).val();
			        if (mo.length > 5) {
			            e.preventDefault();
			            return false;
			        }
			    });
			    $(".PanVD").keyup(function (e) {
			        var mo = $(this).val();
			        if (mo.length > 10) {
			            $(this).val(mo.substr(0, 10));
			        }
			    });

			    $("#address_1,#address_2").click(function (e) {
			        console.log("address click");
			        $(".proceedbtn").prop("disabled", true);
			        $(".proceedbtn").removeClass("active");
			    });

			    var addressline1;
			    $("#address_1").blur(function (e) {
			        addressline1 = $(this).val().trim();
			        addressline1 = addressline1.toLowerCase().replace(/[^A-Za-z0-9]/g, "");
			        //addressline1 = addressline1.toLowerCase().replace(/[,.-_ ]/g,'');
			        console.log("address 1 :" + addressline1);
			        if (addressline1.length < 5) {
			            $(this)
			                .siblings(".errormsg")
			                .show()
			                .text("Add your complete flat/house no.");
			            $(".proceedbtn").removeClass("active");
			            $(".proceedbtn").prop("disabled", true);
			        } else {
			            $(this).siblings(".errormsg").hide();
			            $(".proceedbtn").removeAttr("disabled");
			            $(".proceedbtn").addClass("active");
			        }
			    });

			    $("#address_2").blur(function (e) {
			        var addressline2 = $(this).val().trim();
			        addressline2 = addressline2.toLowerCase().replace(/[^A-Za-z0-9]/g, "");
			        //addressline2 = addressline2.toLowerCase().replace(/[,.-_ ]/g,'');
			        console.log("address 2 :" + addressline2);
			        var finaladdress = addressline1 + addressline2;
			        if (finaladdress.length < 20) {
			            $(this)
			                .siblings(".errormsg")
			                .show()
			                .text("Add area and nearby landmark details");
			            $(".proceedbtn").removeClass("active");
			            $(".proceedbtn").prop("disabled", true);
			        } else {
			            $(this).siblings(".errormsg").hide();
			            $(".proceedbtn").removeAttr("disabled");
			            $(".proceedbtn").addClass("active");
			        }
			    });

			    // for otp fill to green line
			    $(".a_otpPart input").keyup(function () {
			        var vallength = $(this).val().length - 1;
			        $(".a_optlinMain div").eq(vallength).addClass("active");
			        $(".a_optlinMain div").eq(vallength).prevAll().addClass("active");
			        $(".a_optlinMain div").eq(vallength).nextAll().removeClass("active");
			        if (vallength == -1) {
			            $(".a_otpPart .a_optlinMain div").removeClass("active");
			        }
			    });

			    //for UI issue on mobile device
			    $(".a_otpPart .innrfildlte input").focus(function () {
			        if ($(window).width() < 992) {
			            $(this).parents("form").find(".Subbutton").hide();
			        }
			    });
			    $(".a_otpPart .innrfildlte input").blur(function () {
			        if ($(window).width() < 992) {
			            $(this).parents("form").find(".Subbutton").show();
			        }
			    });

			    //resend otp
			    $(".a_resendOtp a").click(function () {
			        //$('.a_otpPart .innrfildlte input').val('');
			        $(".a_otpPart .a_resendOtp").hide();
			        $(".a_otpPart .errormsg").hide();
			        clickText = $(this).text();
			        if (otpcounter < 3) {
			            count3minut();
			            eventCondition = "True";
			            apiRequestCreation("mobNumemi_insta");
			            $(".a_otpPart .a_countText").show();
			        } else {
			            $(".page1").hide();
			            $(".page17").show();
			            retryScenario = "Resend Otp";
			            $(".oh_errorPage .error_retry").addClass("gotologin");
			            $(".oh_errorPage")
			                .find("p")
			                .text("Too many OTP requests. Try again after 30 minutes");
			        }
			        otpcounter++;
			        linkClickDataLayerCall(
			            "Enter OTP",
			            document.title,
			            eventCondition,
			            clickText
			        );
			    });

			    $(".tryAgainMandate strong").click(function () {
			        $(".page10_2").hide();
			        $(".page18").show();
			        $(".page18 .loader_screen_text").find("p").text("Loading...");

			        $.removeCookie("pRelInd", {
			            path: "/",
			        });
			        clickText = $(this).text();
			        eventCondition = "True";
			        linkClickDataLayerCall(
			            "eMandate Failure",
			            document.title,
			            eventCondition,
			            clickText
			        );

			        apiRequestCreation("RetryProcess");
			    });
			    $(".checkConfirm a").click(function () {
			        eventCondition = "True";
			        linkClickDataLayerCall(
			            "Get Your Insta EMI Card",
			            document.title,
			            eventCondition,
			            "T&C"
			        );
			    });
			    $(".buttonPart_1 a").click(function () {
			        eventCondition = "True";
			        linkClickDataLayerCall(
			            "Personal Details",
			            document.title,
			            eventCondition,
			            "T&Cs"
			        );
			    });
			    $(".checkTnc i").click(function () {
			        if ($(".checkConfirm label").hasClass("checked")) {
			            eventCondition = "False";
			        } else {
			            eventCondition = "True";
			        }
			        dataLayer.push({
			            event: "checkbox_click",
			            pageType: document.title,
			            sectionTitle: "Get Your Insta EMI Card",
			            eventCondition: eventCondition,
			            clickText: "T&C",
			        });
			    });

			    $(".feesTitle").click(function () {
			        $(this).toggleClass("active");
			        $(this).siblings(".feesAndChargesCon").slideToggle(200);
			    });

			    $("#mobNumemi_insta input").focusout(function () {
			        var fieldName = $(this).siblings("label").text();
			        var fieldValue = $(this).val();
			        fieldValueDataLayerCall("Verify Mobile Number", "Mobile", fieldValue);
			    });

			    $("#prodetails_1 input").focusout(function (e) {
			        var fieldName = $(this).siblings("label").text();
			        var fieldValue = $(this).val();
			        fieldValueDataLayerCall(
			            "Share details to generate card",
			            fieldName,
			            fieldValue
			        );
			    });

			    $(".datepicker_content .date_part button.done").click(function () {
			        var day = $("p.dateOne").text();
			        var mon = $("p.monthOne").text();
			        var yer = $("p.yearOne").text();
			        var fieldValue = day + "/" + mon + "/" + yer;
			        fieldValueDataLayerCall(
			            "Share details to generate card",
			            "DOB",
			            fieldValue
			        );
			    });

			    $("#addressform input").focusout(function (e) {
			        var fieldName = $(this).siblings("label").text();
			        var fieldValue = $(this).val();
			        fieldValueDataLayerCall("Update Address", fieldName, fieldValue);
			    });

			    // open tooltip

			    $(".summery_data ul li p a").click(function (e) {
			        e.stopPropagation();
			        $(".amountpay_BG").hide();
			        $(this).parents("p").siblings(".amountpay_BG").show();
			    });

			    $(".getItButtonPart .amountPay > a").click(function (e) {
			        e.stopPropagation();
			        $(".amountpay_BG").hide();
			        $(this).siblings(".amountpay_BG").show();
			    });

			    $(document).click(function (e) {
			        e.stopPropagation();
			        $(".getItButtonPart .amountPay > a").siblings(".amountpay_BG").hide();
			        $(".summery_data ul li p a").parents("p").siblings(".amountpay_BG").hide();
			    });

			    $(".mobNumPar").click(function () {
			        $(".getItButtonPart .amountPay > a").siblings(".amountpay_BG").hide();
			    });

			    $(".cardFees a").click(function () {
			        $(this).toggleClass("active");
			        $(this).siblings(".dropTotalAmt").slideToggle(200);
			    });

			    // otp counter
			    var interval;

			    function count3minut() {
			        var timer2 = "0:60";
			        interval = setInterval(function () {
			            var timer = timer2.split(":");
			            var minutes = parseInt(timer[0], 10);
			            var seconds = parseInt(timer[1], 10);
			            --seconds;
			            minutes = seconds < 0 ? --minutes : minutes;
			            seconds = seconds < 0 ? 59 : seconds;
			            seconds = seconds < 10 ? "0" + seconds : seconds;
			            $(".a_otpPart .a_countText p i").html("0" + minutes + ":" + seconds);
			            if (minutes < 0) clearInterval(interval);
			            if (seconds <= 0 && minutes <= 0) clearInterval(interval);
			            timer2 = minutes + ":" + seconds;

			            if (seconds <= 0 && minutes <= 0) {
			                $(".a_otpPart .a_countText").hide();
			                $(".a_otpPart .a_resendOtp").show();
			            }
			        }, 1000);
			    }

			    // for form validation check and go next
			    if ($(window).width() > 991) {
			        $("#mobNumemi_insta .btnstyl").click(function (e) {
			            e.preventDefault();
			            newrelic.addPageAction("insta_pod2", {
			                step: "Generate otp",
			                status: "clicked",
			            });
			            var clicked = $("#mobNumemi_insta .btnstyl").hasClass("clicked");
			            if (!clicked) {
			                if ($(".errormsg").is(":visible")) {
			                    $("#mobNumemi_insta .btnstyl").removeClass("clicked");
			                } else {
			                    $("#mobNumemi_insta .btnstyl").addClass("clicked");
			                }
			                var th = $(this);
			                var topofferr = 0;
			                var frmid = $(this).parents("form").attr("id");
			                clickText = $(this).text();
			                setTimeout(function () {
			                    var topofferr = toperrrorcheck(frmid);
			                    if (topofferr == 0) {
			                        eventCondition = "True";
			                        $(".page1").hide();
			                        $(".page18 .loader_screen_text")
			                            .find("p")
			                            .text("Generating your OTP");
			                        $(".page18").show();
			                        count3minut();
			                        apiRequestCreation(frmid);
			                        submitDataLayerCall(
			                            "Get Your Insta EMI Card",
			                            document.title,
			                            eventCondition,
			                            clickText
			                        );
			                    } else {
			                        eventCondition = "False";
			                        submitDataLayerCall(
			                            "Get Your Insta EMI Card",
			                            document.title,
			                            eventCondition,
			                            clickText
			                        );
			                    }
			                }, 200);
			                return false;
			            }
			        });
			    }

			    $(".forMobPop").click(function () {
			        $(this).hide();
			        $("body").removeAttr("style");
			    });
			    $(".mobNumPar").click(function (e) {
			        e.stopPropagation();
			    });

			    if ($(window).width() < 992) {
			        //$("#mobNumemi_insta .mobileVD").addClass('nomandetory');

			        $("#mobNumemi_insta .checkBtn").click(function (e) {
			            e.preventDefault();
			            trackPageView("GET_IT_NOW");
			            var th = $(this);
			            var topofferr = 0;
			            var frmid = $(this).parents("form").attr("id");
			            clickText = $(this).text();
			            var topofferr = toperrrorcheck(frmid);
			            if (topofferr == 0) {
			                eventCondition = "True";
			                $(".forMobPop").show();
			                $("#mobNumemi_insta .mobileVD").removeClass("nomandetory");
			                submitDataLayerCall(
			                    "Get Your Insta EMI Card",
			                    document.title,
			                    eventCondition,
			                    clickText
			                );
			            } else {
			                eventCondition = "False";
			                submitDataLayerCall(
			                    "Get Your Insta EMI Card",
			                    document.title,
			                    eventCondition,
			                    clickText
			                );
			            }
			        });

			        $("#mobNumemi_insta .mobNumBtn").click(function (e) {
			            e.preventDefault();
			            trackPageView("GENERATE_OTP");

			            newrelic.addPageAction("insta_pod2", {
			                step: "Generate otp",
			                status: "clicked",
			            });

			            var clicked = $("#mobNumemi_insta .mobNumBtn").hasClass("clicked");
			            if (!clicked) {
			                if ($(".errormsg").is(":visible")) {
			                    $("#mobNumemi_insta .mobNumBtn").removeClass("clicked");
			                } else {
			                    $("#mobNumemi_insta .mobNumBtn").addClass("clicked");
			                }
			                var th = $(this);
			                var topofferr = 0;
			                $("#mobNumemi_insta .mobileVD").focus();
			                var frmid = $(this).parents("form").attr("id");
			                clickText = $(this).text();
			                setTimeout(function () {
			                    var topofferr = toperrrorcheck(frmid);
			                    if (topofferr == 0) {
			                        eventCondition = "True";
			                        $(".page1").hide();
			                        $(".forMobPop").hide();
			                        $(".page18").show();
			                        $(".page18 .loader_screen_text")
			                            .find("p")
			                            .text("Generating your OTP");
			                        count3minut();
			                        apiRequestCreation(frmid);
			                        $("body").css({
			                            "overflow-y": "hidden",
			                            position: "fixed",
			                            height: "100%",
			                            width: "100%",
			                        });
			                        $(".page1 .logoName").hide();
			                        $(".page1 .backIemi").show();
			                        $(".page1 .rightLogo").show();
			                        submitDataLayerCall(
			                            "Verify Mobile Number",
			                            document.title,
			                            eventCondition,
			                            clickText
			                        );
			                    } else {
			                        $("html,body").animate(
			                            {
			                                scrollTop: 400,
			                            },
			                            200
			                        );
			                        eventCondition = "False";
			                        submitDataLayerCall(
			                            "Verify Mobile Number",
			                            document.title,
			                            eventCondition,
			                            clickText
			                        );
			                    }
			                }, 200);
			                return false;
			            }
			        });
			    }

			    $("#mobNumemi_insta input").click(function () {
			        currntTime = new Date();
			    });

			    $("#mobNumemi_insta #mobNumb").blur(function () {
			        seconds = parseInt(Math.abs(currntTime - new Date()) / 1000);
			        var topofferr = 0;
			        var frmid = $(this).parents("form").attr("id");
			        var topofferr = toperrrorcheck(frmid);
			        if (topofferr == 0) {
			            fieldTimingDataLayerCall(
			                "Mobile",
			                "Success",
			                "Verify Mobile Number",
			                seconds
			            );
			        } else {
			            fieldTimingDataLayerCall(
			                "Mobile",
			                "Fail",
			                "Verify Mobile Number",
			                seconds
			            );
			        }
			        seconds = "";
			    });

			    $("#cardOtpF2 .btnstyl").click(function (e) {
			        e.preventDefault();
			        trackPageView("SUBMIT_OTP");
			        newrelic.addPageAction("insta_pod2", {
			            step: "Submit otp",
			            status: "clicked",
			        });

			        var clicked = $("#cardOtpF2 .btnstyl").hasClass("clicked");
			        if (!clicked) {
			            if ($(".errormsg").is(":visible")) {
			                $("#cardOtpF2 .btnstyl").removeClass("clicked");
			            } else {
			                $("#cardOtpF2 .btnstyl").addClass("clicked");
			            }
			            var frmid = $(this).parents("form").attr("id");
			            clickText = $(this).text();
			            setTimeout(function () {
			                var topofferr = toperrrorcheck(frmid);
			                if (topofferr == 0) {
			                    eventCondition = "True";
			                    $(".page1").hide();
			                    $(".page18 .loader_screen_text")
			                        .find("p")
			                        .text("Verifying your mobile number");
			                    $(".page18").show();
			                    apiRequestCreation(frmid);
			                    submitDataLayerCall(
			                        "Enter OTP",
			                        document.title,
			                        eventCondition,
			                        clickText
			                    );
			                } else {
			                    eventCondition = "False";
			                    submitDataLayerCall(
			                        "Enter OTP",
			                        document.title,
			                        eventCondition,
			                        clickText
			                    );
			                }
			            }, 200);
			            return false;
			        }
			    });

			    $("#cardOtpF2 input").click(function () {
			        currntTime = new Date();
			    });

			    $("#cardOtpF2 #otp1").blur(function () {
			        seconds = parseInt(Math.abs(currntTime - new Date()) / 1000);
			        var topofferr = 0;
			        var frmid = $(this).parents("form").attr("id");
			        var topofferr = toperrrorcheck(frmid);
			        if (topofferr == 0) {
			            fieldTimingDataLayerCall("OTP1", "Success", "Enter OTP", seconds);
			        } else {
			            fieldTimingDataLayerCall("OTP1", "Fail", "Enter OTP", seconds);
			        }
			        seconds = "";
			    });

			    // partial lead capture at DOB
			    $("#birthDate").blur(function () {
			        if (
			            !$("#birthDate").siblings(".errormsg").is(":visible") &&
			            !$("#fullname").siblings(".errormsg").is(":visible")
			        ) {
			            referID = "Partial form save";
			            WCMLeadCaptureClick("", "", referID);
			        }
			    });

			    // For Anchor tag added new changes

			    $("#prodetails_1 .btnstyl").click(function (e) {
			        e.preventDefault();
			        trackPageView("APPROVAL");
			        newrelic.addPageAction("insta_pod2", {
			            step: "Application form",
			            status: "clicked",
			        });

			        var clicked = $("#prodetails_1 .btnstyl").hasClass("clicked");
			        if (!clicked) {
			            if ($(".errormsg").is(":visible")) {
			                $("#prodetails_1 .btnstyl").removeClass("clicked");
			            } else {
			                $("#prodetails_1 .btnstyl").addClass("clicked");
			            }
			            var frmid = $(this).parents("form").attr("id");
			            /* for datalayer */
			            var gen, emptype;
			            var appdata = JSON.stringify($("#" + frmid).serializeObject());

			            appdata = JSON.parse(appdata);
			            gen = appdata.gender;
			            emptype = appdata.occupation;
			            /* for datalayer */
			            clickText = $(this).text();
			            podRequestId = getCookie("pRI");
			            if (
			                podRequestId != undefined &&
			                podRequestId != "" &&
			                podRequestId != null
			            ) {
			                var decryptpod = decrypt(podRequestId, pkd);
			                podRequestId = decryptpod.toString(CryptoJS.enc.Utf8);
			            }
			            setTimeout(function () {
			                var topofferr = toperrrorcheck(frmid);
			                if (topofferr == 0) {
			                    console.log("appdata: " + JSON.stringify(appdata));
			                    var encchr = encryptlocal(JSON.stringify(appdata), pkd);
			                    setCookie("insta_chr_Cookie", encchr);
			                    eventCondition = "True";
			                    $(".page3").hide();
			                    $(".page18 .loader_screen_text")
			                        .find("p")
			                        .text("Verifying your details");
			                    $(".page18").show();
			                    apiRequestCreation(frmid);

			                    PODRequestsubmitDataLayerCall(
			                        "Personal Details",
			                        document.title,
			                        eventCondition,
			                        clickText,
			                        podRequestId
			                    );
			                    fieldValueDataLayerCall(
			                        "Share details to generate card",
			                        "Gender | Emp Type",
			                        gen + "|" + emptype
			                    );

			                    $("html, body").animate(
			                        {
			                            scrollTop: 0,
			                        },
			                        200
			                    );
			                } else {
			                    eventCondition = "False";
			                    PODRequestsubmitDataLayerCall(
			                        "Personal Details",
			                        document.title,
			                        eventCondition,
			                        clickText,
			                        podRequestId
			                    );

			                    $("html,body").animate(
			                        {
			                            scrollTop: topofferr - 50,
			                        },
			                        200
			                    );
			                }
			            }, 300);
			            return false;
			        }
			    });
			    $("#prodetails_1 .form-group input").click(function (e) {
			        currntTime = new Date();
			    });
			    $("#prodetails_1 .form-group input").each(function (e) {
			        $(this).blur(function (e) {
			            seconds = parseInt(Math.abs(currntTime - new Date()) / 1000);
			            var topofferr = 0;
			            var frmid = $(this).parents("form").attr("id");
			            var topofferr = toperrrorcheck(frmid);
			            if (topofferr == 0) {
			                fieldTimingDataLayerCall(
			                    $(this).siblings("label").text(),
			                    "Success",
			                    "Share details to generate card",
			                    seconds
			                );
			            } else {
			                fieldTimingDataLayerCall(
			                    $(this).siblings("label").text(),
			                    "Fail",
			                    "Share details to generate card",
			                    seconds
			                );
			            }
			            seconds = "";
			        });
			    });

			    $("#addressform .btnstyl").click(function (e) {
			        e.preventDefault();
			        trackPageView("UPDATE_ADDRESS");
			        newrelic.addPageAction("insta_pod2", {
			            step: "Update address",
			            status: "clicked",
			        });

			        var clicked = $("#addressform .btnstyl").hasClass("clicked");
			        if (!clicked) {
			            if ($(".errormsg").is(":visible")) {
			                $("#addressform .btnstyl").removeClass("clicked");
			            } else {
			                $("#addressform .btnstyl").addClass("clicked");
			            }
			            var frmid = $(this).parents("form").attr("id");
			            clickText = $(this).text();
			            setTimeout(function () {
			                var topofferr = toperrrorcheck(frmid);
			                if (topofferr == 0) {
			                    eventCondition = "True";
			                    $(".page7").hide();
			                    $(".page18 .loader_screen_text")
			                        .find("p")
			                        .text("Verifying your KYC details");
			                    $(".page18").show();
			                    apiRequestCreation(frmid);
			                    submitDataLayerCall(
			                        "Update Address",
			                        document.title,
			                        eventCondition,
			                        clickText
			                    );
			                } else {
			                    eventCondition = "False";
			                    submitDataLayerCall(
			                        "Update Address",
			                        document.title,
			                        eventCondition,
			                        clickText
			                    );
			                }
			            }, 300);
			            return false;
			        }
			    });
			    $("#addressform .form-group input").click(function (e) {
			        currntTime = new Date();
			    });
			    $("#addressform .form-group input").each(function (e) {
			        $(this).blur(function (e) {
			            seconds = parseInt(Math.abs(currntTime - new Date()) / 1000);
			            var topofferr = 0;
			            var frmid = $(this).parents("form").attr("id");
			            var topofferr = toperrrorcheck(frmid);
			            if (topofferr == 0) {
			                fieldTimingDataLayerCall(
			                    $(this).siblings("label").text(),
			                    "Success",
			                    "Update Address",
			                    seconds
			                );
			            } else {
			                fieldTimingDataLayerCall(
			                    $(this).siblings("label").text(),
			                    "Fail",
			                    "Update Address",
			                    seconds
			                );
			            }
			            seconds = "";
			        });
			    });

			    $(".icon-icons-bluecalendar").click(function () {
			        currntTime = new Date();
			    });
			    $(".datepicker_content .date_part button.done").click(function () {
			        seconds = parseInt(Math.abs(currntTime - new Date()) / 1000);
			        fieldTimingDataLayerCall(
			            "DOB",
			            "Success",
			            "Share details to generate card",
			            seconds
			        );
			        seconds = "";
			    });
			   
			      //Removed on 30-JAN-2023
			      
			   /* $(".checkConfirm label a").click(function () {
			        $(".page1_1").show();
			        $(".page1").hide();
			        $("html,body").animate(
			            {
			                scrollTop: 0,
			            },
			            0
			        );
			    }); */
			    
			     //Added on 30-JAN-2023  
			    
			    $('.checkConfirm label > a').click(function(){
			        $('.page1_1').show();
			        $('.page1').hide();
			        $('html,body').animate({
			            scrollTop : 0
			        },0);
			    });
			    
			    
			    // for top - bottom button in TNC page
			    $(".tncButtonWhite .goToBottom").click(function () {
			        $(this).toggleClass("scroll_top");
			        if ($(this).hasClass("scroll_top")) {
			            $("html,body").animate({
			                scrollTop: $(document).height(),
			            });
			            $(this).text("Go to top");
			        } else {
			            $("html,body").animate({
			                scrollTop: 0,
			            });
			            $(this).text("Go to bottom");
			        }
			    });
			    // for top - bottom button in TNC page
			    var setDocHeight = 0;
			    $(window).scroll(function () {
			        setDocHeight = $(document).innerHeight();
			        setDocHeight = setDocHeight - 1000;
			        if (setDocHeight <= $(window).scrollTop() + $(window).height()) {
			            $(".tncButtonWhite .goToBottom").addClass("scroll_top");
			            $(".tncButtonWhite .goToBottom").text("Go to top");
			        } else {
			            $(".tncButtonWhite .goToBottom").removeClass("scroll_top");
			            $(".tncButtonWhite .goToBottom").text("Go to bottom");
			        }
			    });
			    $(".openFaq").click(function () {
			        $(".page15").show();
			        $("body").css("overflow-y", "hidden");
			    });
			    $(".buttonPart_1 > button,.page15 .backIemi").click(function () {
			        $(".page15").hide();
			        $("body").css("overflow-y", "auto");
			    });
			    $(".page3 .buttonPart_1 > p a").click(function () {
			        $(".page3").hide();
			        $(".page4").show();

			        $("html,body").animate(
			            {
			                scrollTop: 0,
			            },
			            0
			        );
			    });

			    //Proceed button
			    $(".show6").click(function () {
			        trackPageView("ACCEPT_OFFER");
			        newrelic.addPageAction("insta_pod2", {
			            step: "Offer accept",
			            status: "clicked",
			        });
			        podRequestId = getCookie("pRI");
			        if (
			            podRequestId != undefined &&
			            podRequestId != "" &&
			            podRequestId != null
			        ) {
			            var decryptpod = decrypt(podRequestId, pkd);
			            podRequestId = decryptpod.toString(CryptoJS.enc.Utf8);
			        }
			        var clicked = $(".buttonMain .show6").hasClass("clicked");
			        if (!clicked) {
			            $(".buttonMain .show6").addClass("clicked");
			            clickText = $(this).text();
			            setTimeout(function () {
			                eventCondition = "True";
			                $(".page5").hide();
			                $(".page18 .loader_screen_text")
			                    .find("p")
			                    .text("Redirecting you to the KYC section for verification");
			                $(".page18").show();
			                apiRequestCreation("show6");
			            }, 200);
			            PODRequestsubmitDataLayerCall(
			                "Approved Limit",
			                document.title,
			                eventCondition,
			                clickText,
			                podRequestId
			            );
			            return false;
			        }
			    });

			    $(".show6_ETB").click(function () {
			        trackPageView("ACCEPT_OFFER");
			        newrelic.addPageAction("insta_pod2", {
			            step: "Offer accept etb",
			            status: "clicked",
			        });
			        podRequestId = getCookie("pRI");
			        if (
			            podRequestId != undefined &&
			            podRequestId != "" &&
			            podRequestId != null
			        ) {
			            var decryptpod = decrypt(podRequestId, pkd);
			            podRequestId = decryptpod.toString(CryptoJS.enc.Utf8);
			        }
			        var clicked = $(".buttonETB .show6_ETB").hasClass("clicked");
			        if (!clicked) {
			            $(".buttonETB .show6_ETB").addClass("clicked");
			            clickText = $(this).text();
			            setTimeout(function () {
			                eventCondition = "True";
			                $(".page5").hide();
			                $(".page18 .loader_screen_text")
			                    .find("p")
			                    .text("Proceeding to Pay now page");
			                $(".page18").show();
			                apiRequestCreation("show6_ETB");
			            }, 200);
			            PODRequestsubmitDataLayerCall(
			                "Approved Limit",
			                document.title,
			                eventCondition,
			                clickText,
			                podRequestId
			            );
			            return false;
			        }
			    });

			    //Pay now
			    $(".show8").click(function () {
			        trackPageView("PAY_NOW");
			        newrelic.addPageAction("insta_pod2", {
			            step: "Pay now",
			            status: "clicked",
			        });

			        $(".page8").hide();
			        $(".page18 .loader_screen_text")
			            .find("p")
			            .text("Redirecting you to the payment gateway");
			        $(".page18").show();
			        clickText = $(this).text();
			        eventCondition = "True";
			        podRequestId = getCookie("pRI");
			        if (
			            podRequestId != undefined &&
			            podRequestId != "" &&
			            podRequestId != null
			        ) {
			            var decryptpod = decrypt(podRequestId, pkd);
			            podRequestId = decryptpod.toString(CryptoJS.enc.Utf8);
			        }

			        PODRequestsubmitDataLayerCall(
			            "Summary",
			            document.title,
			            eventCondition,
			            clickText,
			            podRequestId
			        );
			        if (!paymentGatewayURL) {
			            $(".page18").hide();
			            $(".page17").show();
			            referID = "Pay Initiate";
			            parentNameform = "URL not received";
			            WCMLeadCaptureClick("", parentNameform, referID);
			            retryScenario = "paymentGatewayURL not received";
			            $(".oh_errorPage").find("h2").text("Oops! There was an unexpected error");
			            $(".oh_errorPage")
			                .find("p")
			                .text(
			                    "We're unable re-direct you to the payment page. Please try again later"
			                );
			        } else {
			            referID = "Pay Initiate";
			            parentNameform = paymentGatewayURL;
			            WCMLeadCaptureClick("", parentNameform, referID);
			            $("#paymentgate").attr("action", paymentGatewayURL);

			            mobile = getCookie("Zme");
			            if (mobile != undefined && mobile != "" && mobile != null) {
			                var decryptmobile = decrypt(mobile, pkd);
			                mobile = decryptmobile.toString(CryptoJS.enc.Utf8);
			            }
			            $("#paymentRequest").val(payparameter);
			            document.forms["paymentgate"].submit();
			        }
			    });

			    //activate now
			    $(".buttonPart_2 .active9").click(function () {
			        trackPageView("ACTIVATE_NOW");
			        newrelic.addPageAction("insta_pod2", {
			            step: "Activate now",
			            status: "clicked",
			        });

			        $(".page9").hide();
			        $(".page18 .loader_screen_text")
			            .find("p")
			            .text("Redirecting you to e-mandate page");
			        $(".page18").show();
			        clickText = $(this).text();
			        eventCondition = "True";
			        submitDataLayerCall(
			            "Payment Successful",
			            document.title,
			            eventCondition,
			            clickText
			        );
			        if (!mandatePodUrl) {
			            $(".page18").hide();
			            $(".page17").show();
			            referID = "Mandate Initiate";
			            parentNameform = "URL not received";
			            WCMLeadCaptureClick("", parentNameform, referID);
			            retryScenario = "MandatePodUrl not received";
			            $(".oh_errorPage").find("h2").text("Oops! There was an unexpected error");
			            $(".oh_errorPage")
			                .find("p")
			                .text(
			                    "We're unable re-direct you to the e-mandate page. Please try again later"
			                );
			        } else {
			            referID = "Mandate Initiate";
			            parentNameform = mandatePodUrl;
			            WCMLeadCaptureClick("", parentNameform, referID);
			            $("#mandateRedirect").attr("action", mandatePodUrl);
			            document.forms["mandateRedirect"].submit();
			        }
			    });

			    //Retry payment
			    $(".instaEmiCardRepayment > a").click(function () {
			        newrelic.addPageAction("insta_pod2", {
			            step: "Retry payment",
			            status: "clicked",
			        });

			        $(".page13").hide();
			        $(".page18 .loader_screen_text")
			            .find("p")
			            .text("Redirecting you to the payment gateway");
			        $(".page18").show();
			        clickText = $(this).text();
			        eventCondition = "True";
			        submitDataLayerCall(
			            "Payment Failed",
			            document.title,
			            eventCondition,
			            clickText
			        );
			        var payUrl = getCookie("pU");
			        if (payUrl != undefined && payUrl != null && payUrl != "") {
			            var decryptURL = decrypt(payUrl, pkd);
			            payUrl = decryptURL.toString(CryptoJS.enc.Utf8);
			        }
			        var payParameter = getCookie("pM");
			        if (
			            payParameter != undefined &&
			            payParameter != null &&
			            payParameter != ""
			        ) {
			            var decryptParamter = decrypt(payParameter, pkd);
			            payParameter = decryptParamter.toString(CryptoJS.enc.Utf8);
			        }
			        $("#paymentgate").attr("action", payUrl);
			        $("#paymentRequest").val(payParameter);
			        document.forms["paymentgate"].submit();
			    });

			    //datalayer on experia buttons
			    $(".experia1 > a").click(function () {
			        trackPageView("DOWNLOAD_EXPERIA");
			        clickText = $(this).text();
			        eventCondition = "True";
			        submitDataLayerCall(
			            "eMandate Success",
			            document.title,
			            eventCondition,
			            clickText
			        );
			    });
			    $(".experia2 > a").click(function () {
			        trackPageView("DOWNLOAD_EXPERIA");
			        clickText = $(this).text();
			        eventCondition = "True";
			        submitDataLayerCall(
			            "eMandate Failure",
			            document.title,
			            eventCondition,
			            clickText
			        );
			    });
			    $(".experia3 .storelocinsta").click(function () {
			        clickText = $(this).text();
			        eventCondition = "True";
			        submitDataLayerCall(
			            "1920 ETB Active with dealer",
			            document.title,
			            eventCondition,
			            clickText
			        );
			    });
			    $(".error_store_loc").click(function () {
			        clickText = $(this).text();
			        eventCondition = "True";
			        submitDataLayerCall("KYC error", document.title, eventCondition, clickText);
			    });
			    $(".shopNow > a").click(function () {
			        trackPageView("SHOP_NOW");
			        clickText = $(this).text();
			        eventCondition = "True";
			        submitDataLayerCall(
			            "eMandate Success",
			            document.title,
			            eventCondition,
			            clickText
			        );
			    });

			    $(".otheroptioncta").click(function () {
			        if ($(".oh_errorPage .otheroptioncta").hasClass("etbactive")) {
			            clickText = $(this).text();
			            eventCondition = "True";
			            submitDataLayerCall(
			                "ETB Active",
			                document.title,
			                eventCondition,
			                clickText
			            );
			        }
			    });

			    /* card click datalayer call */

			    $(".viewcard").click(function () {
			        clickText = $(this).text();
			        eventCondition = "True";
			        submitDataLayerCall(
			            "Payment Successful",
			            document.title,
			            eventCondition,
			            clickText
			        );
			        referID = "View Card";
			        WCMLeadCaptureClick("", "", referID);
			    });

			    $(".walletcard").click(function () {
			        eventCondition = "True";
			        cardClickDataLayerCall(
			            "eMandate Success",
			            document.title,
			            eventCondition,
			            "Wallet Care"
			        );
			    });

			    $(".cibilcard").click(function () {
			        eventCondition = "True";
			        cardClickDataLayerCall(
			            "eMandate Success",
			            document.title,
			            eventCondition,
			            "CIBIL Score"
			        );
			    });

			    $(".cccard").click(function () {
			        eventCondition = "True";
			        cardClickDataLayerCall(
			            "eMandate Success",
			            document.title,
			            eventCondition,
			            "Credit Card"
			        );
			    });
			    $(".plcard").click(function () {
			        eventCondition = "True";
			        cardClickDataLayerCall(
			            "eMandate Success",
			            document.title,
			            eventCondition,
			            "Flexi Personal Loan"
			        );
			    });

			    $(".emistorecard").click(function () {
			        eventCondition = "True";
			        cardClickDataLayerCall(
			            "eMandate Success",
			            document.title,
			            eventCondition,
			            "Bajaj Mall"
			        );
			    });

			    $(".upicard").click(function () {
			        eventCondition = "True";
			        cardClickDataLayerCall(
			            "eMandate Success",
			            document.title,
			            eventCondition,
			            "UPI Payment"
			        );
			    });

			    /* card click datalayer call */

			    $(".page1_1 .tncButtonWhite .continueBtn").click(function () {
			        $(".page1_1").hide();
			        $(".page1").show();

			        $("body,html").animate(
			            {
			                scrollTop: 0,
			            },
			            0
			        );
			    });
			    $(".page4 .tncButtonWhite .continueBtn").click(function () {
			        $(".page4").hide();
			        $(".page3").show();

			        $("body,html").animate(
			            {
			                scrollTop: 0,
			            },
			            0
			        );
			    });

			    // select date

			    $(document).click(function (e) {
			        if ($(e.target).closest(".datepicker_content").length > 0) {
			            return false;
			        }
			        if ($(".page3").css("display") == "block") {
			            $(".datepicker_fixed").hide();
			            $(".datepicker_content").hide();
			            $("body").removeAttr("style");
			        }
			    });

			    $(".calendericon").click(function (e) {
			        e.stopPropagation();
			        $(this).siblings(".datepicker_fixed").show();
			        $(this)
			            .siblings(".datepicker_fixed")
			            .children(".datepicker_content")
			            .slideDown(400);

			        $(this)
			            .siblings(".datepicker_fixed")
			            .children(".datepicker_content")
			            .children(".dateDisplay")
			            .children(".dateOne")
			            .removeClass("active");

			        $(this)
			            .siblings(".datepicker_fixed")
			            .children(".datepicker_content")
			            .children(".dateDisplay")
			            .children(".yearOne")
			            .addClass("active");

			        $(this)
			            .siblings(".datepicker_fixed")
			            .children(".datepicker_content")
			            .children(".date_part")
			            .hide();
			        $(this)
			            .siblings(".datepicker_fixed")
			            .children(".datepicker_content")
			            .children(".month_part")
			            .hide();
			        $(this)
			            .siblings(".datepicker_fixed")
			            .children(".datepicker_content")
			            .children(".year_part")
			            .show();
			        if ($(window).width() < 769) {
			            $("body").css({
			                "overflow-y": "hidden",
			                position: "fixed",
			                height: "100%",
			                width: "100%",
			            });
			        }
			    });

			    $(".datepicker_content .date_part div a").click(function (e) {
			        e.stopPropagation();
			        $(this).addClass("active");
			        $(this).parent().siblings().children("a").removeClass("active");
			        $(this)
			            .parents(".datepicker_content")
			            .children(".dateDisplay")
			            .children(".dateOne")
			            .text($(this).text());

			        $(this)
			            .parents(".datepicker_content")
			            .children(".dateDisplay")
			            .children(".dateOne")
			            .removeClass("active")
			            .addClass("actived");

			        $(".datepicker_content .date_part button").show();

			        if ($(this).text() == "30") {
			            $(".select30").addClass("notActive");
			        } else if ($(this).text() == "31") {
			            $(".select31").addClass("notActive");
			        } else {
			            $(".select31, .select30").removeClass("notActive");
			        }
			    });

			    $(".datepicker_content .month_part div a").click(function (e) {
			        e.stopPropagation();
			        if (!$(this).hasClass("notActive")) {
			            $(this).addClass("active");
			            $(this).parent().siblings().children("a").removeClass("active");
			            $(this)
			                .parents(".datepicker_content")
			                .children(".dateDisplay")
			                .children(".monthOne")
			                .text($(this).attr("data-mth"));
			            $(this)
			                .parents(".datepicker_content")
			                .children(".dateDisplay")
			                .children(".monthOne")
			                .removeClass("active")
			                .addClass("actived");
			            $(this)
			                .parents(".datepicker_content")
			                .children(".dateDisplay")
			                .children(".dateOne")
			                .addClass("active");
			            setTimeout(function () {
			                $(".month_part").hide();
			                $(".date_part").show();
			            }, 500);
			        }
			    });

			    $("body").on("click", ".year_part > div > div a", function (e) {
			        e.stopPropagation();
			        $(this).addClass("active");
			        $(this).parent().siblings().children("a").removeClass("active");
			        $(this)
			            .parents(".datepicker_content")
			            .children(".dateDisplay")
			            .children(".yearOne")
			            .text($(this).text());
			        $(this)
			            .parents(".datepicker_content")
			            .children(".dateDisplay")
			            .children(".yearOne")
			            .removeClass("active")
			            .addClass("actived");
			        $(this)
			            .parents(".datepicker_content")
			            .children(".dateDisplay")
			            .children(".monthOne")
			            .addClass("active");

			        setTimeout(function () {
			            $(".yearOne").removeClass("active");
			            $(".datepicker_content .month_part div a").removeClass("notActive");
			            $(".year_part").hide();
			            $(".month_part").show();
			        }, 500);
			    });

			    $("body").on(
			        "click",
			        ".datepicker_content .date_part button.cancel",
			        function (e) {
			            e.preventDefault();
			            $(this).parents(".datepicker_content").hide();
			            $(this).parents(".datepicker_fixed").hide();
			            $("body").removeAttr("style");
			        }
			    );

			    $("body").on(
			        "click",
			        ".datepicker_content .date_part button.done",
			        function (e) {
			            e.preventDefault();
			            $(this)
			                .parents(".datepicker_fixed")
			                .siblings(".dobVD")
			                .val(
			                    $(".dateOne").text() +
			                    "/" +
			                    $(".monthOne").text() +
			                    "/" +
			                    $(".yearOne").text()
			                );
			            $(this).parents(".datepicker_content").hide();
			            $(this).parents(".datepicker_fixed").hide();
			            $(this).parents(".datepicker_fixed").siblings(".dobVD").blur();
			            $(this)
			                .parents(".datepicker_fixed")
			                .siblings(".dobVD")
			                .siblings("label")
			                .addClass("active");
			            $("body").removeAttr("style");
			        }
			    );

			    $("body").on("click", ".datepicker_content > a", function () {
			        $(this).parents(".datepicker_content").hide();
			        $(this).parents(".datepicker_fixed").hide();
			    });

			    $(".dateOne").click(function (e) {
			        $(".month_part").hide();
			        $(".year_part").hide();
			        $(".date_part").show();
			    });
			    $(".monthOne").click(function (e) {
			        $(".date_part").hide();
			        $(".year_part").hide();
			        $(".month_part").show();
			    });
			    $(".yearOne").click(function (e) {
			        $(".date_part").hide();
			        $(".month_part").hide();
			        $(".year_part").show();
			    });

			    var getYearLink = "";
			    var d = new Date();
			    var year = d.getFullYear();
			    year = Number(year);
			    year = year - 21;
			    for (var i = year; i >= 1920; i--) {
			        getYearLink = getYearLink + "<div><a>" + i + "</a></div>";
			        $(".datepicker_content .year_part>div").html(getYearLink);
			    }

			    //For showing tooltip
			    $(".openToolTip").click(function (e) {
			        e.stopPropagation();
			        e.preventDefault();
			        $(".a_tooltipone").hide();
			        $(this).next(".a_tooltipone").show();
			        $(this).next(".pantooltip_BG").show();
			        $(".a_tooltipone.pantooltip").show();
			    });
			    $(".mandateOpt a").click(function (e) {
			        e.stopPropagation();
			        $(".a_tooltipone").hide();
			        $(this).next(".a_tooltipone").show();
			    });
			    $(".innrfildlte .panpopup").click(function (e) {
			        e.stopPropagation();
			        e.preventDefault();
			        $(".pantooltip_BG").hide();
			        $(this).next(".pantooltip_BG").show();
			        $(".a_tooltipone.pantooltip").show();
			    });
			    $(".paynow_tooltip strong a").click(function (e) {
			        e.stopPropagation();
			        e.preventDefault();
			        $(".amountpay_BG").show();
			    });
			    $(".a_tooltipone.pantooltip a").click(function () {
			        $(".pantooltip_BG").hide();
			    });
			    $(".pantooltip_BG").click(function () {
			        $(this).hide();
			    });
			    $(".a_tooltipone").click(function (e) {
			        e.stopPropagation();
			    });
			    //For hide tooltip
			    $(document).click(function () {
			        $(".a_tooltipone").hide();
			    });
			    $(document).click(function () {
			        $(".pantooltip_BG").hide();
			    });
			    $(".doneBTN").click(function () {
			        $(".amountpay_BG").hide();
			    });
			    $(".e_mandate_details a").click(function () {
			        $(this).parents(".emendetePop").hide();
			    });
			    $(".AV_loan ul li a").click(function () {
			        $(".emendetePop").css("display", "flex");
			    });

			    $(".cibilBanner_wht > .cibilBanner > a").click(function () {
			        $(".page9").hide();
			        $(".page9_1").show();
			        var card_display = getCookie("displayOnCard");
			        if (
			            card_display != null &&
			            card_display != undefined &&
			            card_display != ""
			        ) {
			            var decryptCustName = decrypt(card_display, pkd);
			            card_display = decryptCustName.toString(CryptoJS.enc.Utf8);
			        }
			        $(".custname").text("Hello " + card_display + ",");
			    });
			    $(".page9_1 .goBack").click(function () {
			        $(".page9_1").hide();
			        $(".page9").show();
			    });

			    // for personal details form change input on tab
			    $("#prodetails_1 .innrfildlte input").keydown(function (event) {
			        var k = event.which;
			        if (k == 9) {
			            var getClass = $(this)
			                .parents(".a_width330")
			                .next()
			                .find("input")
			                .attr("class");
			            setTimeout(function () {
			                $("." + getClass).focus();
			            }, 100);
			        }
			    });

			    // Faq load

			    var faqLoad = `<h2>Frequently asked questions <i></i></h2>
			                      <div class="faqaccord_box">
			                        <div class="faq_card onpage_faq">
			                           <h3>What is the Bajaj Finserv Insta EMI Card?<i></i></h3>
			                           <div class="accord_descbox">
			                              <p>The Bajaj Finserv Insta EMI Card is a payment instrument that lets you convert all your purchases into No Cost EMIs. The Insta EMI Card involves a 100% online application process and is activated instantly for you.</p>
			                           </div>
			                        </div>
			                        <div class="faq_card onpage_faq">
			                           <h3>What is the eligibility age to apply for a Bajaj Finserv Insta EMI Card?<i></i></h3>
			                           <div class="accord_descbox">
			                              <p>If you are between 21 and 65 years of age, you can apply for Bajaj Finserv Insta EMI Card.</p>       
			                           </div>
			                        </div>
			                        <div class="faq_card onpage_faq">
			                           <h3>What documents do I need to submit to get an Insta EMI Card?<i></i></h3>
			                           <div class="accord_descbox">
			                              <p>No documents are needed to get your Insta EMI Card. All you need to do is, keep the following details ready:</p>
			                              <ol>
			                                 <li>PAN Card</li>
			                                 <li>Aadhaar number for KYC confirmation</li>
			                                 <li>Bank a/c number and IFSC code for e-mandate registration</li>
			                              </ol>
			                           </div>
			                        </div>
			                          <div class="faq_card onpage_faq">
			                           <h3>How do I register my e-mandate?<i></i></h3>
			                           <div class="accord_descbox">
			                              <p>To register your e-mandate, you need to:</p>
			                              <ol>
			                                 <li>Share your bank account and IFSC code</li>
			                                 <li>Verify all the details entered by you</li>
			                                 <li>Submit OTP for validation purposes</li>
			                              </ol>
			                           </div>
			                        </div>
			                         <div class="faq_card onpage_faq">
			                           <h3>What are the benefits of e-mandate registration?<i></i></h3>
			                           <div class="accord_descbox">
			                              <p>By registering your e-mandate, you will:</p>
			                              <ul>
			                                 <li>Never miss on your EMI payments with the auto-debit feature</li>
			                                 <li>Manage your loans in an efficient manner</li>
			                                 <li>Not be required to submit documents at the time of purchase</li>
			                              </ul>
			                           </div>
			                        </div>
			                        <div class="faq_card onpage_faq">
			                           <h3>How do I use the Bajaj Finserv Insta EMI Card?<i></i></h3>
			                           <div class="accord_descbox">
			                              <p>Just like the EMI Network Card, you can shop using the Insta EMI Card at any of our online and offline partner stores on No Cost EMIs. All you need to do is provide your card details and verify your purchase with an OTP sent to your registered mobile number.</p>
			                           </div>
			                        </div>
			                        <div class="faq_card onpage_faq">
			                           <h3>When will I receive my Insta EMI Card?<i></i></h3>
			                           <div class="accord_descbox">
			                              <p>The Insta EMI Card is a digital card, that gets activated online instantly. Therefore, you will not receive a physical card; simply access it on the Bajaj Finserv app.</p>
			                           </div>
			                        </div>
			                         <div class="faq_card onpage_faq">
			                           <h3>Where can I view my Insta EMI Card details?<i></i></h3>
			                           <div class="accord_descbox">
			                              <p>You can view your card details on the Bajaj Finserv app.</p>
			                           </div>
			                        </div>
			                        <div class="faq_card onpage_faq">
			                           <h3>How do I view my Insta EMI Card details on the Bajaj Finserv app?<i></i></h3>
			                           <div class="accord_descbox">
			                              <p>Follow the below mentioned steps:</p>
			                              <ol>
			                                 <li>Download the app</li>
			                                 <li>Enter your registered mobile number</li>
			                                 <li>Submit the OTP sent to your mobile number</li>
			                                 <li>Click on 'KNOW MORE'</li>   
			                                 <li>Enter your date of birth</li>
			                                 <li>View your Insta EMI Card</li>			
			                              </ol>
			                           </div>
			                        </div>
			                        <div class="faq_card onpage_faq">
			                           <h3>Why do I need the Bajaj Finserv app for my Insta EMI Card?<i></i></h3>
			                           <div class="accord_descbox">
			                              <p>With the Bajaj Finserv app, you can:</p>
			                              <ol>
			                                 <li>Access your Insta EMI Card and all related details</li>
			                                 <li>Avail offers</li>
			                              </ol>
			                           </div>
			                        </div>
			                      </div>`;

			    $(".faqLoad").html(faqLoad);

			    //data layer for FAQ
			    var faqeventCondition;

			    $(".faqLoad i").click(function () {
			        if ($(".faqLoad h2").hasClass("active")) {
			            faqeventCondition = "Close";
			        } else {
			            faqeventCondition = "Open";
			        }
			        faqClickDataLayerCall(
			            document.title,
			            "Get Your Insta EMI Card",
			            faqeventCondition,
			            "FAQs"
			        );
			    });

			    $(".onpage_faq  h3").click(function () {
			        if ($(".onpage_faq h3").hasClass("active")) {
			            faqeventCondition = "Close";
			        } else {
			            faqeventCondition = "Open";
			        }
			        clickText = $(this).text();
			        faqClickDataLayerCall(
			            document.title,
			            "Get Your Insta EMI Card",
			            faqeventCondition,
			            "FAQ |" + clickText
			        );
			    });

			    $(".openFaq").click(function () {
			        eventCondition = "True";
			        submitDataLayerCall("Top Banner", document.title, eventCondition, "FAQs");
			    });

			    var pageNumber;

			    $(document).on("click", ".openFaq", function (e) {
			        var getClass = $(this)
			            .parent()
			            .parent()
			            .parent()
			            .parent()
			            .parent()
			            .closest("div")
			            .attr("class")
			            .split(" ");
			        pageNumber = getClass[0];
			    });

			    $(".drop_faq_card  h3").click(function () {
			        if ($(".drop_faq_card h3").hasClass("active")) {
			            faqeventCondition = "Close";
			        } else {
			            faqeventCondition = "Open";
			        }
			        clickText = $(this).text();
			        if (pageNumber == "page7") {
			            faqClickDataLayerCall(
			                document.title,
			                "Update Address",
			                faqeventCondition,
			                "FAQ |" + clickText
			            );
			        } else {
			            faqClickDataLayerCall(
			                document.title,
			                "Top Banner",
			                faqeventCondition,
			                "FAQ |" + clickText
			            );
			        }
			    });

			    var retryattempts = 0;
			    $(".oh_errorPage .error_retry").click(function () {
			        $(".page17").hide();
			        $(".page18").hide(); //loader
			        clickText = $(this).text();
			        retryattempts++;
			        console.log(
			            "retry attempts: " + retryattempts + " retry datalayer :" + retryScenario
			        );
			        eventCondition = "True";
			        submitDataLayerCall(
			            "Retry | " + retryScenario,
			            document.title,
			            eventCondition,
			            clickText
			        );

			        if (retryattempts < 3) {
			            if (retryPageHandling == "prodetails_1") {
			                $(".page3").show();
			                $("#prodetails_1 .btnstyl").removeClass("clicked");
			            } else if (
			                retryPageHandling == "show6" ||
			                retryPageHandling == "show6_ETB"
			            ) {
			                $(".page5").show();
			                $(".buttonMain .show6").removeClass("clicked");
			                $(".buttonETB .show6_ETB").removeClass("clicked");
			            } else if (retryPageHandling == "addressform") {
			                $(".page7").show();
			                $("#addressform .btnstyl").removeClass("clicked");
			            } else {
			                if ($(".oh_errorPage .error_retry").hasClass("gotologin")) {
			                    window.location.href = "/insta-emi-network-card-apply-online";
			                } else {
			                    $(".page18 .loader_screen_text").find("p").text("Loading...");
			                    $(".page18").show();
			                    apiRequestCreation("RetryProcess");
			                }
			            }
			        } else {
			            window.location.href = "/insta-emi-network-card-apply-online";
			        }
			    });

			    $(".otpfieldandCount > a,.otpPartMain .topTitle p a").click(function () {
			        $(".otpFixed").hide();
			        $(".getTheCard").show();
			        $(".forMobPop").show();
			        clearInterval(interval);
			        $(".a_countText").show();
			        $(".a_resendOtp").hide();
			        $(".page1 .myTracker").hide();
			        $("#mobNumemi_insta .mobNumBtn").removeClass("clicked");
			        $("#mobNumemi_insta .btnstyl").removeClass("clicked");
			        var offSetTop = $(".cardAndDetails").offset().top;
			        $("html, body").animate(
			            {
			                scrollTop: offSetTop - 10,
			            },
			            200
			        );
			        $("#mobNumb").val("");
			        $("body").removeAttr("style");
			    });

			    $(".buttonPart_3 > div > .Subbutton").click(function () {
			        $(".page9_1").hide();
			        $(".page18 .loader_screen_text")
			            .find("p")
			            .text("Redirecting you to the payment gateway");
			        $(".page18").show();
			        var chrcookie = getCookie("insta_chr_Cookie");
			        var instadata;
			        console.log(chrcookie);
			        if (chrcookie != null && chrcookie != "" && chrcookie != undefined) {
			            instadata = chrcookie;
			            var decryptData = decrypt(instadata, pkd);
			            instadata = decryptData.toString(CryptoJS.enc.Utf8);
			            var mobile = getCookie("Zme");
			            if (mobile != undefined && mobile != "" && mobile != null) {
			                var decryptmobile = decrypt(mobile, pkd);
			                mobile = decryptmobile.toString(CryptoJS.enc.Utf8);
			            }
			            cibilRequestCreation(instadata, PageURL, mobile);
			        }
			    });

			    $(".page9_2Show").click(function () {
			        $(".page9_2").show();
			        $(".page9_1").hide();
			        $("html,body").animate(
			            {
			                scrollTop: 0,
			            },
			            0
			        );
			    });

			    $(".page9_3Show").click(function () {
			        $(".page9_3").show();
			        $(".page9_1").hide();
			        $("html,body").animate(
			            {
			                scrollTop: 0,
			            },
			            0
			        );
			    });

			    $(".page9_2 .tncButtonWhite .continueBtn").click(function () {
			        $(".page9_2").hide();
			        $(".page9_1").show();

			        $("body,html").animate(
			            {
			                scrollTop: 0,
			            },
			            0
			        );
			    });

			    $(".page9_3 .tncButtonWhite .continueBtn").click(function () {
			        $(".page9_3").hide();
			        $(".page9_1").show();

			        $("body,html").animate(
			            {
			                scrollTop: 0,
			            },
			            0
			        );
			    });

			    /*24-08-2021*/

			    $(".myTracker .stepCC i a").click(function () {
			        $(this).parents(".myTracker").toggleClass("showLess");
			        $(this)
			            .parents(".rightPart")
			            .siblings(".leftPart")
			            .find(".otpPartMain")
			            .toggleClass("top90");
			    });

			    /* utm paramters start */
			    function getUrlValue(name) {
			        if (
			            (name = new RegExp("[?&]" + encodeURIComponent(name) + "=([^&]*)").exec(
			                location.search
			            ))
			        ) {
			            return decodeURIComponent(name[1]);
			        }
			    }

			    function GetCookie(name) {
			        var valCookie = $.cookie(name);
			        if (
			            valCookie === null ||
			            valCookie === "null" ||
			            valCookie === undefined ||
			            valCookie === "undefined"
			        ) {
			            return null;
			        } else {
			            return valCookie;
			        }
			    }

			    function formdetails(frmid) {
			        var ap = "[id='" + frmid + "']";
			        var logindata = JSON.stringify($(ap).serializeObject());
			        logindata = JSON.parse(logindata);
			        var utmnewCookie = GetCookie("utm_new_cookie");
			        if (utmnewCookie != null && utmnewCookie != undefined) {
			            utmnewCookie = JSON.parse(utmnewCookie);
			            if ("PartialLeadCapture" == frmid) {
			                logindata.utmCampaignUtmTrue = utmnewCookie["utm_campaign"];
			                logindata.utmMediumUtmTrue = utmnewCookie["utm_medium"];
			                logindata.utmSourceUtmTrue = utmnewCookie["utm_source"];
			            } else {
			                logindata.utmCampaign = utmnewCookie["utm_campaign"];
			                logindata.utmMedium = utmnewCookie["utm_medium"];
			                logindata.utmSource = utmnewCookie["utm_source"];
			            }
			        } else {
			            if ("PartialLeadCapture" == frmid) {
			                logindata.utmCampaignUtmTrue = utmnewCookie["utm_campaign"];
			                logindata.utmMediumUtmTrue = utmnewCookie["utm_medium"];
			                logindata.utmSourceUtmTrue = utmnewCookie["utm_source"];
			            } else {
			                logindata.utmCampaign = "website";
			                logindata.utmMedium = "bfl";
			                logindata.utmSource = "organic_bfl";
			            }
			        }
			        return logindata;
			    }
			    /* utm paramters end */

			    /* integration on all ajax calls start here */

			    function apiRequestCreation(frmid) {
			        var datalist, lastClickedClickTrue, deviceTrue, clientId;

			        TokenCSRF = GetCookie("CSRFtoken");
			        var lastclick = getCookie("LastClickCookie");
			        if (lastclick != null && lastclick != "" && lastclick != undefined) {
			            lastclick = JSON.parse(lastclick);
			            lastClickedClickTrue = lastclick.click;
			        } else {
			            lastClickedClickTrue = "Not available";
			        }
			        var device = getCookie("tvc_device_details");
			        if (device != null && device != "" && device != undefined) {
			            device = JSON.parse(device);
			            deviceTrue = device.dc;
			        } else {
			            deviceTrue = "Not available";
			        }
			        var gid = getCookie("_ga");
			        if (gid != null && gid != "" && gid != undefined) {
			            clientId = gid;
			        } else {
			            clientId = "Not available";
			        }

			        if ("CustFromBFDL" == frmid) {
			            datalist = {
			                data: encData,
			            };
			        }
			        if ("mobNumemi_insta" == frmid) {
			            datalist = formdetails(frmid);
			            datalist.clientId = clientId;
			            datalist.firstName = "Insta";
			            datalist.lastName = "EMI";
			            datalist.fullName = "Insta EMI";
			            datalist.mobileNo = $("#mobNumb").val();
			            datalist.product = "IEMIPMG";
			            datalist.pageUrlTrue = PageURL;
			            datalist.referId = "Send OTP";
			            datalist.lastClickedClickTrue = lastClickedClickTrue;
			            datalist.deviceTrue = deviceTrue;
			            //datalist.productOfferingType = "";
			            mobile = $("#mobNumb").val();
			            var encryptMobile = encryptlocal(mobile, pkd);
			            setCookie("Zme", encryptMobile);
			        }
			        if ("cardOtpF2" == frmid) {
			            mobile = getCookie("Zme");
			            if (mobile != undefined && mobile != "" && mobile != null) {
			                var decryptmobile = decrypt(mobile, pkd);
			                mobile = decryptmobile.toString(CryptoJS.enc.Utf8);
			            }
			            var sourceCustomerType = source_cust_type;
			            console.log("SourceCustomerType " + sourceCustomerType);
			            if (sourceCustomerType == null) {
			                sourceCustomerType = "";
			            }
			            var otpValue = $("#otp1").val();
			            datalist = formdetails(frmid);
			            datalist.clientId = clientId;
			            datalist.mobileNo = mobile;
			            datalist.channelId = setChannelID();
			            datalist.partnerApplicationId = "Wb_1234";
			            datalist.sourceChannelIp = "23.46.9.120";   //For dynamic put sourceChannelIp    
			            datalist.cardType = "EC";
			            datalist.cardSubType = "EC";
			            datalist.primaryAddonIndicator = "P";
			            datalist.otpValue = otpValue;
			            datalist.podRequestId = "";
			            datalist.otpRequestId = otpRequestId;
			            datalist.tncVersionNumber = "424230";
			            datalist.tncFlag = "1";
			            datalist.sourceCustomerType = sourceCustomerType;
			            datalist.pageUrlTrue = PageURL;
			            datalist.referId = "Validate OTP";
			            datalist.lastClickedClickTrue = lastClickedClickTrue;
			            datalist.deviceTrue = deviceTrue;
			        }
			        if ("prodetails_1" == frmid) {
			            datalist = JSON.stringify($("#" + frmid).serializeObject());
			            datalist = JSON.parse(datalist);
			            mobile = getCookie("Zme");
			            if (mobile != undefined && mobile != "" && mobile != null) {
			                var decryptmobile = decrypt(mobile, pkd);
			                mobile = decryptmobile.toString(CryptoJS.enc.Utf8);
			            }
			            customerFullName = datalist.customerFullName;
			            var date_of_birth = datalist.dob;
			            var fields = date_of_birth.split("/");
			            var dd = fields[0];
			            var mm = fields[1];
			            var yyyy = fields[2];
			            date_of_birth = yyyy + "-" + mm + "-" + dd;
			            var encryptDob = encryptlocal(date_of_birth, pkd);
			            setCookie("encDB", encryptDob);
			            datalist = formdetails(frmid);
			            datalist.clientId = clientId;
			            datalist.mobileNo = mobile;
			            datalist.channelId = setChannelID();
			            datalist.partnerApplicationId = "Wb_1234";
			            datalist.sourceChannelIp = sourceChannelIp;
			            datalist.cardType = "EC";
			            datalist.podRequestId = podRequestId;
			            datalist.dob = date_of_birth;
			            datalist.tncVersionNumber = "424230";
			            datalist.tncFlag = "1";
			            datalist.pageUrlTrue = PageURL;
			            datalist.referId = "Form submission";
			            datalist.lastClickedClickTrue = lastClickedClickTrue;
			            datalist.deviceTrue = deviceTrue;
			        }
			        if ("show6" == frmid) {
			            datalist = formdetails(frmid);
			            datalist.clientId = clientId;
			            mobile = getCookie("Zme");
			            if (mobile != undefined && mobile != "" && mobile != null) {
			                var decryptmobile = decrypt(mobile, pkd);
			                mobile = decryptmobile.toString(CryptoJS.enc.Utf8);
			            }
			            datalist.channelId = setChannelID();
			            datalist.partnerApplicationId = "Wb_1234";
			            datalist.sourceChannelIp = sourceChannelIp;
			            datalist.podRequestId = podRequestId;
			            datalist.mobileNo = mobile;
			            datalist.tncFlag = "1";
			            datalist.pageUrlTrue = PageURL;
			            datalist.referId = "UND offer acceptance";
			            datalist.lastClickedClickTrue = lastClickedClickTrue;
			            datalist.deviceTrue = deviceTrue;
			        }
			        if ("show6_ETB" == frmid) {
			            var dob, aFullName, aDob, aReleationship, aEmail;
			            mobile = getCookie("Zme");
			            if (mobile != undefined && mobile != "" && mobile != null) {
			                var decryptmobile = decrypt(mobile, pkd);
			                mobile = decryptmobile.toString(CryptoJS.enc.Utf8);
			            }
			            datalist = formdetails(frmid);
			            datalist.clientId = clientId;
			            datalist.channelId = setChannelID();
			            datalist.partnerApplicationId = "Wb_1234";
			            datalist.sourceChannelIp = sourceChannelIp;
			            datalist.podRequestId = podRequestId;
			            datalist.dob = Custdob;
			            datalist.aFullName = "";
			            datalist.aDob = "";
			            datalist.aReleationship = "";
			            datalist.aEmail = "";
			            datalist.mobileNo = mobile;
			            datalist.tncFlag = "1";
			            datalist.pageUrlTrue = PageURL;
			            datalist.referId = "UND ETB Customer";
			            datalist.lastClickedClickTrue = lastClickedClickTrue;
			            datalist.deviceTrue = deviceTrue;
			        }
			        if ("KycInProcess" == frmid) {
			            podRequestId = getCookie("pRI");
			            if (
			                podRequestId != undefined &&
			                podRequestId != "" &&
			                podRequestId != null
			            ) {
			                var decryptpod = decrypt(podRequestId, pkd);
			                podRequestId = decryptpod.toString(CryptoJS.enc.Utf8);
			            }
			            mobile = getCookie("Zme");
			            if (mobile != undefined && mobile != "" && mobile != null) {
			                var decryptmobile = decrypt(mobile, pkd);
			                mobile = decryptmobile.toString(CryptoJS.enc.Utf8);
			            }
			            var kycPodEncryptedReponse = respFromKycPage;
			            var customerAcceptanceFlag,
			                updatedAddressLine1,
			                updatedAddressLine2,
			                updatedAddressLine3;
			            var updatedPinCode, updatedCity, updatedState;
			            datalist = formdetails(frmid);
			            datalist.clientId = clientId;
			            datalist.channelId = setChannelID();
			            datalist.partnerApplicationId = "Wb_1234";
			            datalist.sourceChannelIp = sourceChannelIp;
			            datalist.podRequestId = podRequestId;
			            datalist.mobileNo = mobile;
			            datalist.kycPodEncryptedReponse = kycPodEncryptedReponse;
			            datalist.customerAcceptanceFlag = "N";
			            datalist.updatedAddressLine1 = "";
			            datalist.updatedAddressLine2 = "";
			            datalist.updatedAddressLine3 = "";
			            datalist.updatedPinCode = "";
			            datalist.updatedCity = "";
			            datalist.updatedState = "";
			            datalist.pageUrlTrue = PageURL;
			            datalist.referId = "KYC";
			            datalist.lastClickedClickTrue = lastClickedClickTrue;
			            datalist.deviceTrue = deviceTrue;
			        }
			        if ("addressform" == frmid) {
			            datalist = JSON.stringify($("#" + frmid).serializeObject());
			            datalist = JSON.parse(datalist);
			            podRequestId = getCookie("pRI");
			            if (
			                podRequestId != undefined &&
			                podRequestId != "" &&
			                podRequestId != null
			            ) {
			                var decryptpod = decrypt(podRequestId, pkd);
			                podRequestId = decryptpod.toString(CryptoJS.enc.Utf8);
			            }
			            mobile = getCookie("Zme");
			            if (mobile != undefined && mobile != "" && mobile != null) {
			                var decryptmobile = decrypt(mobile, pkd);
			                mobile = decryptmobile.toString(CryptoJS.enc.Utf8);
			            }

			            var relationshipType;

			            //$("#id:checked ").val();
			            if (document.getElementById("mother").checked == true) {
			                relationshipType = $("#mother").val();
			            } else if (document.getElementById("father").checked == true) {
			                relationshipType = $("#father").val();
			            } else if (document.getElementById("spouse").checked == true) {
			                relationshipType = $("#spouse").val();
			            } else {
			                relationshipType = null;
			                console.log("Somther went wrong: " + null);
			            }
			            console.log("Relationship Type: " + relationshipType);

			            var customerAcceptanceFlag = "N";
			            if (
			                addressStatus == true ||
			                addressStatus == "true" ||
			                relationshipStatus == true ||
			                relationshipStatus == "true"
			            ) {
			                customerAcceptanceFlag = "Y";
			            }

			            var kycPodEncryptedReponse = respFromKycPage;

			            datalist = formdetails(frmid);
			            datalist.clientId = clientId;
			            datalist.channelId = setChannelID();
			            datalist.partnerApplicationId = "Wb_1234";
			            datalist.sourceChannelIp = sourceChannelIp;
			            datalist.podRequestId = podRequestId;
			            datalist.mobileNo = mobile;
			            datalist.kycPodEncryptedReponse = kycPodEncryptedReponse;
			            datalist.customerAcceptanceFlag = customerAcceptanceFlag;
			            datalist.updatedAddressLine1 = checkEmptyOrNull($("#address_1").val());
			            datalist.updatedAddressLine2 = checkEmptyOrNull($("#address_2").val());
			            datalist.updatedAddressLine3 = "NA";
			            datalist.updatedPinCode = checkEmptyOrNull($("#pinCode2").val());
			            datalist.updatedCity = checkEmptyOrNull($("#city").val());
			            datalist.updatedState = checkEmptyOrNull($("#state").val());
			            datalist.pageUrlTrue = PageURL;
			            datalist.referId = "Update address";
			            datalist.lastClickedClickTrue = lastClickedClickTrue;
			            datalist.deviceTrue = deviceTrue;
			            datalist.relationshipType = relationshipType;
			            datalist.relationshipName = checkEmptyOrNull($("#fullname_2").val());
			        }
			        if ("PaymentProcess" == frmid) {
			            podRequestId = getCookie("pRI");
			            if (
			                podRequestId != undefined &&
			                podRequestId != "" &&
			                podRequestId != null
			            ) {
			                var decryptpod = decrypt(podRequestId, pkd);
			                podRequestId = decryptpod.toString(CryptoJS.enc.Utf8);
			            }
			            mobile = getCookie("Zme");
			            if (mobile != undefined && mobile != "" && mobile != null) {
			                var decryptmobile = decrypt(mobile, pkd);
			                mobile = decryptmobile.toString(CryptoJS.enc.Utf8);
			            }

			            var paymentPodResponse = respFromPayPage;

			            datalist = formdetails(frmid);
			            datalist.clientId = clientId;
			            datalist.channelId = setChannelID();
			            datalist.partnerApplicationId = "Wb_1234";
			            datalist.sourceChannelIp = sourceChannelIp;
			            datalist.podRequestId = podRequestId;
			            datalist.mobileNo = mobile;
			            datalist.paymentPodResponse = paymentPodResponse;
			            datalist.pageUrlTrue = PageURL;
			            datalist.referId = "Payment Response";
			            datalist.lastClickedClickTrue = lastClickedClickTrue;
			            datalist.deviceTrue = deviceTrue;
			        }
			        if ("MandateProcess" == frmid) {
			            podRequestId = getCookie("pRI");
			            if (
			                podRequestId != undefined &&
			                podRequestId != "" &&
			                podRequestId != null
			            ) {
			                var decryptpod = decrypt(podRequestId, pkd);
			                podRequestId = decryptpod.toString(CryptoJS.enc.Utf8);
			            }
			            mobile = getCookie("Zme");
			            if (mobile != undefined && mobile != "" && mobile != null) {
			                var decryptmobile = decrypt(mobile, pkd);
			                mobile = decryptmobile.toString(CryptoJS.enc.Utf8);
			            }
			            var mandatePodEncryptedReponse = resFromMandatePage;
			            datalist = formdetails(frmid);
			            datalist.clientId = clientId;
			            datalist.channelId = setChannelID();
			            datalist.partnerApplicationId = "Wb_1234";
			            datalist.sourceChannelIp = sourceChannelIp;
			            datalist.podRequestId = podRequestId;
			            datalist.mobileNo = mobile;
			            datalist.mandatePodEncryptedReponse = mandatePodEncryptedReponse;
			            datalist.pageUrlTrue = PageURL;
			            datalist.referId = "Emandate Response";
			            datalist.lastClickedClickTrue = lastClickedClickTrue;
			            datalist.deviceTrue = deviceTrue;
			        }
			        if ("RetryProcess" == frmid) {
			            podRequestId = getCookie("pRI");
			            if (
			                podRequestId != undefined &&
			                podRequestId != "" &&
			                podRequestId != null
			            ) {
			                var decryptpod = decrypt(podRequestId, pkd);
			                podRequestId = decryptpod.toString(CryptoJS.enc.Utf8);
			            }
			            mobile = getCookie("Zme");
			            if (mobile != undefined && mobile != "" && mobile != null) {
			                var decryptmobile = decrypt(mobile, pkd);
			                mobile = decryptmobile.toString(CryptoJS.enc.Utf8);
			            }
			            datalist = formdetails(frmid);
			            datalist.clientId = clientId;
			            datalist.channelId = setChannelID();
			            datalist.partnerApplicationId = "Wb_1234";
			            datalist.sourceChannelIp = sourceChannelIp;
			            datalist.customerDeviceIp = sourceChannelIp;
			            datalist.podRequestId = podRequestId;
			            datalist.mobileNo = mobile;
			            datalist.cardType = "EC";
			            datalist.cardSubType = "EC";
			            datalist.primaryAddonIndicator = "P";
			            datalist.tncVersionNumber = "424230";
			            datalist.tncFlag = "1";
			            datalist.pageUrlTrue = PageURL;
			            datalist.referId = "Retry";
			            datalist.lastClickedClickTrue = lastClickedClickTrue;
			            datalist.deviceTrue = deviceTrue;
			        }

			        console.log(JSON.stringify(datalist));
			        var sVal = generateSVal(20);
			        var encptReqVal = encptdata(sVal, JSON.stringify(datalist));
			        var requestData = {
			            reqData: encptReqVal,
			            _csrf: TokenCSRF,
			        };
			        //Ajax URL StepWise Mappings
			        var ajaxParameter = stepWiseUrlMapping(frmid);
			        var url = ajaxParameter[0];
			        $.ajax({
			            url: API_Domain + ajaxParameter[0],
			            type: ajaxParameter[1],
			            data: JSON.stringify(requestData),
			            headers: {
			                "Content-Type": "application/json",
			                reqKey: sVal,
			                source: "IEMI POD2 PMG",
			                urlPath: "insta-emi-network-card-apply-online",
			            },
			            crossDomain: true,
			            timeout: 35000,
			            xhrFields: {
			                withCredentials: "true",
			            },
			            error: function (responseFromApi) {
			                //new relic noticeError
			                if (responseFromApi.status == "403") {
			                    if (counter < 3) {
			                        console.log("counter : " + counter);
			                        $.removeCookie("_csrf", {
			                            path: "/",
			                            domain: ".bajajfinserv.in",
			                        });

			                        totkenGeneartionApi();
			                        apiRequestCreation(frmid);
			                        newrelic.noticeError(JSON.stringify(responseFromApi), {
			                            attribute1: "custom_error",
			                            attribute2: url,
			                            attribute3: "403",
			                        });
			                    } else {
			                        $(".page18").hide();
			                        $(".page17").show();
			                        apiErrorHandlings("403", url, null);
			                        newrelic.noticeError(JSON.stringify(responseFromApi), {
			                            attribute1: "custom_error",
			                            attribute2: url,
			                            attribute3: "403 crsf down",
			                        });
			                    }
			                    counter++;
			                } else if (responseFromApi.status == "400") {
			                    $(".page18").hide();
			                    $(".page17").show();
			                    retryScenario = "Ajax Error 400";
			                    $(".oh_errorPage .error_retry").addClass("gotologin");
			                    $(".oh_errorPage").find("p").text("Something went wrong");
			                    retryPageHandling = frmid;
			                    newrelic.noticeError(JSON.stringify(responseFromApi), {
			                        attribute1: "custom_error",
			                        attribute2: url,
			                        attribute3: "400",
			                    });
			                } else {
			                    $(".page18").hide();
			                    $(".page17").show();
			                    apiErrorHandlings(responseFromApi.status, url, responseFromApi);
			                    newrelic.noticeError(JSON.stringify(responseFromApi), {
			                        attribute1: "custom_error",
			                        attribute2: url,
			                        attribute3: responseFromApi.status,
			                    });
			                }
			            },
			            success: function (responseFromApi) {
			                var response = decptdata(sVal, responseFromApi);
			                console.log("response: " + response);
			                responseFromApi = JSON.parse(response);
			                //API Response Handlings Call
			                apiResponseManipulations(frmid, responseFromApi, url);
			            },
			        });
			    }

			    function generateSVal(length) {
			        var chars = "0123456789ABCDEFabcdef";
			        var sVal = "";
			        for (var i = 0; i < length; i++) {
			            var appendchar = chars.charAt(Math.floor(Math.random() * chars.length));
			            sVal = sVal + appendchar;
			        }
			        return sVal;
			    }

			    function encptdata(sVal, reqData) {
			        var iterationCount = 1000;
			        var keySize = 256;
			        var passphrase = "48a4833ce7";
			        iv = "04843306e4780ccf4480c0ee752e9521";
			        var aesUtil = new AesUtil(keySize, iterationCount);
			        return aesUtil.encrypt(sVal, iv, passphrase, reqData);
			    }

			    function decptdata(sVal, encptedResponsedata) {
			        var itrCnt = 1000;
			        var kySze = 256;
			        var ivctr = "04843306e4780ccf4480c0ee752e9521";
			        var pphrse = "48a4833ce7";
			        var aesUtil = new AesUtil(kySze, itrCnt);
			        var cphertxt1 = aesUtil.decrypt(sVal, ivctr, pphrse, encptedResponsedata);
			        return cphertxt1;
			    }

			    //Ajax URL StepWise call
			    function stepWiseUrlMapping(frmid) {
			        var ajaxParameter = [];
			        var url;

			        switch (frmid) {
			            case "CustFromBFDL":
			                url = "api/v1/iemi/extractparams";
			                methd = "POST";
			                ajaxParameter.push(url);
			                ajaxParameter.push(methd);
			                break;
			            case "mobNumemi_insta":
			                url = "api/v1/otp/send";
			                methd = "POST";
			                ajaxParameter.push(url);
			                ajaxParameter.push(methd);
			                break;
			            case "cardOtpF2":
			                url = "api/v1/iemi/otpverify";
			                methd = "POST";
			                ajaxParameter.push(url);
			                ajaxParameter.push(methd);
			                break;
			            case "prodetails_1":
			                url = "api/v1/iemi/und";
			                methd = "POST";
			                ajaxParameter.push(url);
			                ajaxParameter.push(methd);
			                break;
			            case "show6":
			                url = "api/v1/iemi/undaccept";
			                methd = "POST";
			                ajaxParameter.push(url);
			                ajaxParameter.push(methd);
			                break;
			            case "show6_ETB":
			                url = "api/v1/iemi/undetbcustomer";
			                methd = "POST";
			                ajaxParameter.push(url);
			                ajaxParameter.push(methd);
			                break;
			            case "KycInProcess":
			                url = "api/v1/iemi/confirmkyc";
			                methd = "POST";
			                ajaxParameter.push(url);
			                ajaxParameter.push(methd);
			                break;
			            case "addressform":
			                url = "api/v1/iemi/confirmkyc";
			                methd = "POST";
			                ajaxParameter.push(url);
			                ajaxParameter.push(methd);
			                break;
			            case "PaymentProcess":
			                url = "api/v1/iemi/payment";
			                methd = "POST";
			                ajaxParameter.push(url);
			                ajaxParameter.push(methd);
			                break;
			            case "MandateProcess":
			                url = "api/v1/iemi/mandate";
			                methd = "POST";
			                ajaxParameter.push(url);
			                ajaxParameter.push(methd);
			                break;
			            case "RetryProcess":
			                url = "api/v1/iemi/retry";
			                methd = "POST";
			                ajaxParameter.push(url);
			                ajaxParameter.push(methd);
			                break;
			            default:
			        }
			        return ajaxParameter;
			    }

			    function apiResponseManipulations(frmid, responseFromApi, url) {
			        $(".page18").hide();

			        if ("CustFromBFDL" == frmid) {
			            if (responseFromApi.statusCode == 90) {
			                newrelic.addPageAction("insta_pod2", {
			                    step: "Page load PMG",
			                    status: "success",
			                });

			                source_cust_type = responseFromApi.data.customerType;
			                console.log("cust_type " + cust_type);
			                stepWiseSuccessRespManip(frmid, responseFromApi, url);
			            } else {
			                $(".page17").show();
			                newrelic.addPageAction("insta_pod2", {
			                    step: "Page load PMG",
			                    status: "failed",
			                });
			                apiErrorHandlings(responseFromApi.statusCode, url, responseFromApi);
			            }
			        }
			        if ("mobNumemi_insta" == frmid) {
			            if (responseFromApi.response.statusCode == 90) {
			                newrelic.addPageAction("insta_pod2", {
			                    step: "Generate otp",
			                    status: "success",
			                });
			                stepWiseSuccessRespManip(frmid, responseFromApi, url);
			            } else {
			                newrelic.addPageAction("insta_pod2", {
			                    step: "Generate otp",
			                    status: "failed",
			                });
			                $(".page17").show();
			                retryScenario = "Generate otp";
			                $(".oh_errorPage .error_retry").addClass("gotologin");
			                apiErrorHandlings(
			                    responseFromApi.response.statusCode,
			                    url,
			                    responseFromApi
			                );
			            }
			        }
			        if ("cardOtpF2" == frmid) {
			            //var responseFromApi = { "data":{ "podRequestId":"114803", "currentStage":"OTPV", "nextStage":null, "lastStageData":"null", "currentStageData":"{\"cardType\":\"EC\",\"customerId\":\"201738996\",\"cardStatus\":\"ACTIVE\",\"documentCollectionFlag\":\"N\"}", "customerType":"ETB", "channelId":"Website", "requestDatetime":"2022-05-30T14:49:32.716Z", "responseDatetime":"2022-05-30T14:49:32.8972809Z", "status":"F", "message":"114|Customer Is Active" }, "statusCode":99, "status":"error", "message":"" };
			            //var responseFromApi = {"data":{"podRequestId":"130314","currentStage":"OTPV","nextStage":null,"lastStageData":"null","currentStageData":"{}","customerType":"ETB","channelId":"Website","requestDatetime":"2022-10-20T14:49:32.716Z","responseDatetime":"2022-10-20T14:49:32.8972809Z","status":"F","message":"2023|No offer found"},"statusCode":99,"status":"error","message":""};
			            //var responseFromApi = {"data":{"podRequestId":"4221597","currentStage":"APLF","nextStage":"CPMT","lastStageData":{"cardLimit":"107500","firstTransactionLimit":"107500","cardFeeAmount":"530","customerName":"AKASH N","paymentRefrenceNumber":"YIC41565877064","documentCollectionFlag":"N"},"currentStageData":{"cardLimit":"107500","paymentGatewayURL":"https://payment.bajajfinserv.in/Payments/Payment_Redirect.aspx","paymentGatewayParameters":"msg=WEBSITE|4221597|530|P4221597|AKASH N|WEBSITE_EMI|WEBSITE|ETB|NA|CARD|https://www.bajajfinserv.in/insta-emi-network-card-apply-online|3827C9FBD12F477F296EFE8AB48AED317AACF7681B6DDDD97C46D4595B9F6B37","cardType":"EC","digitalTransactionAllowed":"Y","customerId":"153508681"},"customerType":"ETB","channelId":"Website","requestDatetime":"2022-11-17T15:42:58.207Z","responseDatetime":"2022-11-17T15:42:58.3119860Z","status":"P","message":"1038|SUCCESS"},"statusCode":90,"status":"success","message":""};
			            //var responseFromApi = {data:{"podRequestId":"25360388","currentStage":"CCP","nextStage":"CCP","lastStageData":{"cardLimit":"75000","firstTransactionLimit":"50000","cardFeeAmount":"530","cardNumber":"2030403074893427","customerName":"MOIN MAKSUD BAGWAN","paymentRefrenceNumber":"YIC41441292699","newAddressToBeUpdated":"false","documentCollectionFlag":"N","updateRelationshipFlag":"false"},"currentStageData":{"mandatePodUrl":"https://emandate.bajajfinserv.in/Mandate/SourceReq_App?uid=r6L5sfEwuO6B0ilyvlZ6fzkDoxNTb62fvTNoFV5DoU2pPAlVEs7/9yN5rY8Dyw8u&mode=ui"},"customerType":null,"channelId":"Website","requestDatetime":"2022-09-29T13:06:39.273Z","responseDatetime":"2022-09-29T13:06:39.4315982Z","status":"F","message":"2006|Card Onboarding Failed, Will reflow"},"statusCode":90,"status":"success","message":""}
			            
			            //var responseFromApi = {"data":{"podRequestId":"157842","currentStage":"OTPV","nextStage":null,"lastStageData":"null","currentStageData":"{\"cardType\":\"EC\",\"offerData\":[{\"id\":\"-credit_card_oms-ZZZ02D84AD75B3B2FF6D6702C59BE803\",\"offerId\":\"ZZZ02D84AD75B3B2FF6D6702C59BE803\",\"amount\":\"50000\",\"flag\":\"E\",\"poName\":\"credit_card_oms\",\"product\":null,\"premium\":null,\"displayName\":\"RBL\",\"partnerName\":null,\"displayPriority\":2,\"offerCreationDate\":null,\"icorsOfferType\":\"credit_card_oms\",\"offferId\":null,\"isGeneric\":null,\"emiCardLimit\":null,\"offerType\":null},{\"id\":\"-credit_card_oms-ZZZ01D84AD75B3B2FF6D6702C59BE803\",\"offerId\":\"ZZZ01D84AD75B3B2FF6D6702C59BE803\",\"amount\":\"50000\",\"flag\":\"P\",\"poName\":\"credit_card_oms\",\"product\":null,\"premium\":null,\"displayName\":\"DBS\",\"partnerName\":null,\"displayPriority\":2,\"offerCreationDate\":null,\"icorsOfferType\":\"credit_card_oms\",\"offferId\":null,\"isGeneric\":null,\"emiCardLimit\":null,\"offerType\":null}],\"customerId\":\"150019066\",\"cardStatus\":\"ACTIVE\",\"documentCollectionFlag\":\"Y\",\"carddesign\":\"15\",\"consentflag\":\"N\"}","customerType":"ETB","channelId":"Website","requestDatetime":"2023-01-31T09:39:01.722Z","responseDatetime":"2023-01-31T09:39:02.5659186Z","status":"F","message":"1920|Customer Is Active"},"statusCode":99,"status":"error","message":""};
			            //console.log("changed responseFromApi: " + JSON.stringify(responseFromApi)); 
			            if (
			                (responseFromApi.statusCode == 90 ||
			                    responseFromApi.statusCode == 99) &&
			                responseFromApi.data != ""
			            ) {
			                var customertype = responseFromApi.data.customerType;

			                if (
			                    customertype != null &&
			                    customertype != "" &&
			                    customertype != undefined
			                ) {
			                    cust_type = customertype;
			                } else {
			                    cust_type = "Not available";
			                }
			                dataLayer.push({
			                    event: "api_response",
			                    clickText: "Customer |" + cust_type,
			                    pageType: document.title,
			                });
			                stepWiseSuccessRespManip(frmid, responseFromApi, url);
			            } else {
			                $(".page17").show();
			                retryScenario = "Submit otp";
			                $(".oh_errorPage .error_retry").addClass("gotologin");
			                apiErrorHandlings(responseFromApi.statusCode, url, responseFromApi);
			            }
			        }
			        if ("prodetails_1" == frmid) {
			            if (
			                (responseFromApi.statusCode == 90 ||
			                    responseFromApi.statusCode == 99) &&
			                responseFromApi.data != ""
			            ) {
			                dataLayer.push({
			                    event: "api_response",
			                    clickText: "Card Approval |" + responseFromApi.status,
			                    pageType: document.title,
			                });
			                stepWiseSuccessRespManip(frmid, responseFromApi, url);
			            } else {
			                $(".page17").show();
			                dataLayer.push({
			                    event: "api_response",
			                    clickText: "Card Approval |" + responseFromApi.status,
			                    pageType: document.title,
			                });
			                apiErrorHandlings(responseFromApi.statusCode, url, responseFromApi);
			            }
			        }
			        if ("show6" == frmid || "show6_ETB" == frmid) {
			            if (
			                (responseFromApi.statusCode == 90 ||
			                    responseFromApi.statusCode == 99) &&
			                responseFromApi.data != ""
			            ) {
			                stepWiseSuccessRespManip(frmid, responseFromApi, url);
			            } else {
			                $(".page17").show();
			                apiErrorHandlings(responseFromApi.statusCode, url, responseFromApi);
			            }
			        }
			        if ("KycInProcess" == frmid) {
			            if (
			                (responseFromApi.statusCode == 90 ||
			                    responseFromApi.statusCode == 99) &&
			                responseFromApi.data != ""
			            ) {
			                dataLayer.push({
			                    event: "api_response",
			                    clickText: "KYC |" + responseFromApi.status,
			                    pageType: document.title,
			                });
			                stepWiseSuccessRespManip(frmid, responseFromApi, url);
			            } else {
			                $(".page17").show();
			                apiErrorHandlings(responseFromApi.statusCode, url, responseFromApi);
			                dataLayer.push({
			                    event: "api_response",
			                    clickText: "KYC |" + responseFromApi.status,
			                    pageType: document.title,
			                });
			            }
			        }
			        if ("addressform" == frmid) {
			            if (
			                (responseFromApi.statusCode == 90 ||
			                    responseFromApi.statusCode == 99) &&
			                responseFromApi.data != ""
			            ) {
			                stepWiseSuccessRespManip(frmid, responseFromApi, url);
			            } else {
			                $(".page17").show();
			                apiErrorHandlings(responseFromApi.statusCode, url, responseFromApi);
			            }
			        }
			        if ("PaymentProcess" == frmid) {
			            if (
			                (responseFromApi.statusCode == 90 ||
			                    responseFromApi.statusCode == 99) &&
			                responseFromApi.data != ""
			            ) {
			                dataLayer.push({
			                    event: "api_response",
			                    clickText: "Payment |" + responseFromApi.status,
			                    pageType: document.title,
			                });
			                stepWiseSuccessRespManip(frmid, responseFromApi, url);
			            } else if (
			                responseFromApi.statusCode == 99 &&
			                responseFromApi.data == ""
			            ) {
			                $(".page17").show();
			                apiErrorHandlings(responseFromApi.statusCode, url, null);
			                dataLayer.push({
			                    event: "api_response",
			                    clickText: "Payment |" + responseFromApi.status,
			                    pageType: document.title,
			                });
			            } else {
			                $(".page17").show();
			                apiErrorHandlings(responseFromApi.statusCode, url, responseFromApi);
			                dataLayer.push({
			                    event: "api_response",
			                    clickText: "Payment |" + responseFromApi.status,
			                    pageType: document.title,
			                });
			            }
			        }
			        if ("MandateProcess" == frmid) {
			            if (
			                (responseFromApi.statusCode == 90 ||
			                    responseFromApi.statusCode == 99) &&
			                responseFromApi.data != ""
			            ) {
			                dataLayer.push({
			                    event: "api_response",
			                    clickText: "eMandate |" + responseFromApi.status,
			                    pageType: document.title,
			                });
			                stepWiseSuccessRespManip(frmid, responseFromApi, url);
			            } else {
			                $(".page17").show();
			                apiErrorHandlings(responseFromApi.statusCode, url, responseFromApi);
			                dataLayer.push({
			                    event: "api_response",
			                    clickText: "eMandate |" + responseFromApi.status,
			                    pageType: document.title,
			                });
			            }
			        }
			        if ("RetryProcess" == frmid) {
			            if (
			                (responseFromApi.statusCode == 90 ||
			                    responseFromApi.statusCode == 99) &&
			                responseFromApi.data != ""
			            ) {
			                stepWiseSuccessRespManip(frmid, responseFromApi, url);
			            } else {
			                $(".page17").show();
			                apiErrorHandlings(responseFromApi.statusCode, url, responseFromApi);
			            }
			        }
			    }

			    function stepWiseSuccessRespManip(frmid, responseFromApi, url) {
			        switch (frmid) {
			            case "CustFromBFDL":
			                DecryptRequestSuccessManip(responseFromApi);
			                break;
			            case "mobNumemi_insta":
			                otpSendSuccessManip(responseFromApi);
			                break;
			            case "cardOtpF2":
			                otpVdSuccessManip(responseFromApi, url);
			                break;
			            case "prodetails_1":
			                ApplFormSuccessManip(responseFromApi, url);
			                break;
			            case "show6":
			                proceedKycSuccessManip(responseFromApi, url);
			                break;
			            case "show6_ETB":
			                proceedPayETBSuccessManip(responseFromApi, url);
			                break;
			            case "KycInProcess":
			                ConfirmKycSuccessManip(responseFromApi, url);
			                break;
			            case "addressform":
			                UpdatedAddrKycSuccessManip(responseFromApi, url);
			                break;
			            case "PaymentProcess":
			                PaymentGtwySuccessManip(responseFromApi, url);
			                break;
			            case "MandateProcess":
			                MandateRegSuccessManip(responseFromApi, url);
			                break;
			            case "RetryProcess":
			                RetryAgainSuccessManip(responseFromApi, url);
			                break;
			            default:
			        }
			    }

			    function journeyContinueCreateCookie(responseFromApi) {
			        podRequestId = responseFromApi.data.podRequestId;
			        var encryptpodReqID = encryptlocal(podRequestId, pkd);
			        setCookie("pRI", encryptpodReqID);
			        var cardLimit = responseFromApi.data.lastStageData.cardLimit;
			        var cardFeeAmount = responseFromApi.data.lastStageData.cardFeeAmount;
			        var firstTransactionLimit =
			            responseFromApi.data.lastStageData.firstTransactionLimit;
			        var transactionDetail = {};
			        transactionDetail.cardLimit = cardLimit;
			        transactionDetail.cardFeeAmount = cardFeeAmount;
			        transactionDetail.firstTransactionLimit = firstTransactionLimit;
			        var enctxn = encryptlocal(JSON.stringify(transactionDetail), pkd);
			        setCookie("enctxn", enctxn);
			    }

			    function DecryptRequestSuccessManip(responseFromApi) {
			        $(".page1").show();
			        $("#mobNumemi_insta").show();
			        $(".getItButtonPart i strong").text("+91 " + responseFromApi.data.mobileno);
			        var PMG_mob = responseFromApi.data.mobileno;
			        if (
			            PMG_mob != null &&
			            PMG_mob != "null" &&
			            PMG_mob != undefined &&
			            PMG_mob != ""
			        ) {
			            console.log("inside PMG_mob");
			            $("#mobNumb").val(PMG_mob);
			        }
			        var custname = responseFromApi.data.name;
			        if (
			            custname != null &&
			            custname != "null" &&
			            custname != undefined &&
			            custname != ""
			        ) {
			            $(".cardContant .username").text(custname);
			        }
			    }

			    function otpSendSuccessManip(responseFromApi) {
			        if (responseFromApi.response.status == "success") {
			            otpRequestId = responseFromApi.response.data[0].request_id;
			            $(".page1").show();
			            $(".otpFixed").css("display", "flex");
			            $(".otpPartMain .topTitle p i").text("+91 " + $("#mobNumb").val());
			            $("html,body").animate(
			                {
			                    scrollTop: 0,
			                },
			                0
			            );
			        } else {
			            $(".page17").show();
			            retryScenario = "Generate otp";
			            $(".oh_errorPage .error_retry").addClass("gotologin");
			            $(".oh_errorPage")
			                .find("p")
			                .text("An unexpected error occurred. Try again after some time.");
			        }
			    }

			    function otpVdSuccessManip(responseFromApi, url) {
			        console.log(url);
			        $("#otp1").val("");

			        if (
			            responseFromApi.data.status != null &&
			            responseFromApi.data.status != "null" &&
			            responseFromApi.data.message != null &&
			            responseFromApi.data.message != "null" &&
			            responseFromApi.data.message != undefined
			        ) {
			            message = messagesplitter(responseFromApi);
			        }

			        if (
			            responseFromApi.data.status == "P" &&
			            (message == "1038" ||
			                message == "1080" ||
			                message == "1006" ||
			                message == "1005" ||
			                message == "1010" ||
			                message == "1049" ||
			                message == "1004" ||
			                message == "1099" ||
			                message == "1056" ||
			                message == "1035" ||
			                message == "2065" ||
			                message == "2001" ||
			                message == "2052" ||
			                message == "1030" ||
			                message == "1032" ||
			                message == "1039" ||
			                message == "1040" ||
			                message == "1041" ||
			                message == "1042" ||
			                message == "1016" ||
			                message == "1090" ||
			                message == "1091" ||
			                message == "1921" ||
			                message == "2006" ||
			                message == "1018" ||
			                message == "2009")
			        ) {
			            podRequestId = responseFromApi.data.podRequestId;
			            var encryptpodReqID = encryptlocal(podRequestId, pkd);
			            setCookie("pRI", encryptpodReqID);
			            var leadCampaign, leadMedium, leadSource;
			            var utmnewCookie = GetCookie("utm_new_cookie");
			            if (utmnewCookie != null && utmnewCookie != undefined) {
			                utmnewCookie = JSON.parse(utmnewCookie);
			                leadCampaign = utmnewCookie["utm_campaign"];
			                leadMedium = utmnewCookie["utm_medium"];
			                leadSource = utmnewCookie["utm_source"];
			            }

			            if (
			                responseFromApi.data.customerType == "NTB" ||
			                responseFromApi.data.customerType == "PTB"
			            ) {
			                setCookie("CType", responseFromApi.data.customerType);
			                var instaCustName;

			                if (responseFromApi.data.nextStage == "APLF") {
			                    if (
			                        leadCampaign == "1" &&
			                        leadMedium == "TUN" &&
			                        leadSource == "Partner"
			                    ) {
			                        transunionLeadCaptureInsta(podRequestId, true, false);
			                    }
			                    $(".page3").show();
			                    $("html, body").animate(
			                        {
			                            scrollTop: 0,
			                        },
			                        200
			                    );
			                    $("body").removeAttr("style");
			                } else if (responseFromApi.data.nextStage == "UND") {
			                    if (
			                        leadCampaign == "1" &&
			                        leadMedium == "TUN" &&
			                        leadSource == "Partner"
			                    ) {
			                        transunionLeadCaptureInsta(podRequestId, true, false);
			                    }
			                    $(".page3").show();
			                    $("html, body").animate(
			                        {
			                            scrollTop: 0,
			                        },
			                        200
			                    );
			                    $("body").removeAttr("style");
			                } else if (responseFromApi.data.nextStage == "UVC") {
			                    if (
			                        leadCampaign == "1" &&
			                        leadMedium == "TUN" &&
			                        leadSource == "Partner"
			                    ) {
			                        transunionLeadCaptureInsta(podRequestId, true, true);
			                    }
			                    $(".page5").show();
			                    journeyContinueCreateCookie(responseFromApi);

			                    var cardLimit = responseFromApi.data.lastStageData.cardLimit;
			                    instaCustName = responseFromApi.data.lastStageData.customerName;
			                    $(".addonprice").text("Rs. " + addCommaInAmount(cardLimit));

			                    $(".validfrom").text(validFrom);
			                    $(".validtill").text(validTill);
			                    $(".username").text(instaCustName);
			                    var displayOnCard = instaCustName;
			                    var encryptCustName = encryptlocal(displayOnCard, pkd);
			                    setCookie("displayOnCard", encryptCustName);
			                    $("html, body").animate(
			                        {
			                            scrollTop: 0,
			                        },
			                        200
			                    );
			                    $("body").removeAttr("style");
			                } else if (responseFromApi.data.nextStage == "CVC") {
			                    journeyContinueCreateCookie(responseFromApi);
			                    var ckyc_url = responseFromApi.data.currentStageData.kycPodUrl;

			                    if (ckyc_url != "" && ckyc_url != null && ckyc_url != undefined) {
			                        window.location.href = ckyc_url;
			                    } else {
			                        $(".page17").show();
			                        retryScenario = "Submit otp Resume journey CVC";
			                        $(".oh_errorPage .error_retry").addClass("gotologin");
			                        $(".oh_errorPage")
			                            .find("h2")
			                            .text("Oops! There was an unexpected error");
			                        $(".oh_errorPage")
			                            .find("p")
			                            .text(
			                                "We're unable re-direct you to the KYC page. Please try again later"
			                            );
			                    }
			                } else if (responseFromApi.data.nextStage == "CVP") {
			                    journeyContinueCreateCookie(responseFromApi);

			                    $(".page7").show();
			                    respFromKycPage = "null";

			                    checkAddressAndRelation(responseFromApi);

			                    /*var add1 = responseFromApi.data.currentStageData.addressLine1;
			                                 var add2 = responseFromApi.data.currentStageData.addressLine2;
			                                 var addpin = responseFromApi.data.currentStageData.addressPin;
			                                 var addcity = responseFromApi.data.currentStageData.addressCity;
			                                 var addstate = responseFromApi.data.currentStageData.addressState;
			                                 
			                                 
			              
			                                 if (add1 != undefined || add1 != null || add1 != "null") {
			                                   $(".page7 #addressform label[for='address_1']").addClass("active");
			                                   //$("#address_1").val(add1);
			                                 }
			                                 if (add2 != undefined || add2 != null || add2 != "null") {
			                                   $(".page7 #addressform label[for='address_2']").addClass("active");
			                                   //$("#address_2").val(add2);
			                                 }
			                                 if (addpin != undefined || addpin != null || addpin != "null") {
			                                   $(".page7 #addressform label[for='pinCode2']").addClass("active");
			                                   //$("#pinCode2").val(addpin);
			                                 }
			                                 if (addcity != undefined || addcity != null || addcity != "null") {
			                                   $(".page7 #addressform label[for='city']").addClass("active");
			                                   //$("#city").val(addcity);
			                                 }
			                                 if (addstate != undefined || addstate != null || addstate != "null") {
			                                   $(".page7 #addressform label[for='state']").addClass("active");
			                                   //$("#state").val(addstate);
			                                 }*/
			                    $(".proceedbtn").removeAttr("disabled");
			                    $(".proceedbtn").addClass("active");
			                    console.log("below Submit OTP CVP");

			                    var newAddressUpdate =
			                        responseFromApi.data.currentStageData.newAddressToBeUpdated;
			                    if (newAddressUpdate == undefined || newAddressUpdate == null) {
			                        newAddressUpdate = "false";
			                    } else {
			                        newAddressUpdate = newAddressUpdate;
			                    }
			                    setCookie("nAtbUp", newAddressUpdate);
			                    $("html, body").animate(
			                        {
			                            scrollTop: 0,
			                        },
			                        200
			                    );
			                    $("body").removeAttr("style");
			                } else if (responseFromApi.data.nextStage == "CPMT") {
			                    $(".page8").show();
			                    journeyContinueCreateCookie(responseFromApi);

			                    paymentGatewayURL =
			                        responseFromApi.data.currentStageData.paymentGatewayURL;
			                    paymentGatewayParameters =
			                        responseFromApi.data.currentStageData.paymentGatewayParameters;
			                    var docollectflag =
			                        responseFromApi.data.lastStageData.documentCollectionFlag;
			                    if (docollectflag == "Y") {
			                        $(".AddFalse").hide();
			                        $(".AddTrue").show();
			                    }
			                    payparameter = paymentGatewayParameters;
			                    var fields = payparameter.split("=");
			                    payparameter = fields[1];
			                    var pURL = paymentGatewayURL;
			                    var encryptpURL = encryptlocal(pURL, pkd);
			                    setCookie("pU", encryptpURL);
			                    var pMeter = payparameter;
			                    var encryptpMeter = encryptlocal(pMeter, pkd);
			                    setCookie("pM", encryptpMeter);
			                    var updateAddress =
			                        responseFromApi.data.lastStageData.newAddressToBeUpdated;

			                    if (updateAddress == undefined || updateAddress == null) {
			                        updateAddress = "false";
			                    } else {
			                        updateAddress = updateAddress;
			                    }

			                    setCookie("nAtbUp", updateAddress);

			                    $(".climit").text(
			                        "Rs. " +
			                        addCommaInAmount(responseFromApi.data.lastStageData.cardLimit)
			                    );
			                    $(".firsttxnlimit").text(
			                        "Rs. " +
			                        addCommaInAmount(
			                            responseFromApi.data.lastStageData.firstTransactionLimit
			                        )
			                    );

			                    $(".amountpay_RU").html(
			                        "<p><strong>Rs. " +
			                        responseFromApi.data.lastStageData.cardFeeAmount +
			                        '<a><i class="icon-noun_Info" onclick="amtpaytooltip();"></i></a></strong><i>Amount to be paid</i></p>'
			                    );
			                    $("html, body").animate(
			                        {
			                            scrollTop: 0,
			                        },
			                        200
			                    );
			                    $("body").removeAttr("style");
			                } else if (responseFromApi.data.nextStage == "CMND") {
			                    $(".page9").show();
			                    $(".payment_text p").html(
			                        "You have successfully made a payment of <b>Rs. " +
			                        responseFromApi.data.lastStageData.cardFeeAmount +
			                        "</b> towards your joining fee of EMI Network Card."
			                    );

			                    $(".trackerMain").show();
			                    $(".trackerETB").hide();
			                    journeyContinueCreateCookie(responseFromApi);

			                    var cardNumber = responseFromApi.data.lastStageData.cardNumber;
			                    var encryptccno = encryptlocal(cardNumber, pkd);
			                    setCookie("iecn", encryptccno);
			                    var updateAddress =
			                        responseFromApi.data.lastStageData.newAddressToBeUpdated;
			                    if (updateAddress == undefined || updateAddress == null) {
			                        updateAddress = "false";
			                    } else {
			                        updateAddress = updateAddress;
			                    }
			                    setCookie("nAtbUp", updateAddress);

			                    mandatePodUrl = responseFromApi.data.currentStageData.mandatePodUrl;
			                    var paymentTxnReferenceNumber =
			                        responseFromApi.data.lastStageData.paymentRefrenceNumber;
			                    $(".txnrefno").text(paymentTxnReferenceNumber);
			                    instaCustName = responseFromApi.data.lastStageData.customerName;
			                    var displayOnCard = instaCustName;
			                    var encryptCustName = encryptlocal(displayOnCard, pkd);
			                    setCookie("displayOnCard", encryptCustName);
			                    $("html, body").animate(
			                        {
			                            scrollTop: 0,
			                        },
			                        200
			                    );
			                    $("body").removeAttr("style");
			                } else if (responseFromApi.data.nextStage == "CPLT") {
			                    $(".page10").show();
			                    pageReloadIndentifier = "MS-10";
			                    setCookie("pRelInd", pageReloadIndentifier);
			                    var updateAddress =
			                        responseFromApi.data.lastStageData.newAddressToBeUpdated;
			                    if (updateAddress == "true") {
			                        $(".shopNow").hide();
			                        $(".shopOnFull_1").hide();
			                    } else {
			                        $(".shopNow").show();
			                        $(".shopOnFull_1").show();
			                    }
			                    setCookie("nAtbUp", updateAddress);
			                    var qrcheck;
			                    var utmnewCookie = GetCookie("utm_new_cookie");
			                    if (utmnewCookie != null && utmnewCookie != undefined) {
			                        utmnewCookie = JSON.parse(utmnewCookie);
			                        var qrCampaign = utmnewCookie["utm_campaign"];
			                        console.log("utm campaign value : " + qrCampaign);
			                        qrcheck = instaLinkUtmMapping(qrCampaign);
			                        if (qrcheck) {
			                            $(".Exclusive_Offers_slider").html(exclisve);
			                        }
			                    }
			                    var cardNumber = responseFromApi.data.lastStageData.cardNumber;
			                    cardNumber = cardNumber.replace(/.(?=.{4})/g, "X");
			                    $(".cardContant").find("strong").text(cardNumber);
			                    $(".numberside").text(cardNumber);
			                    var encryptccno = encryptlocal(cardNumber, pkd);
			                    setCookie("iecn", encryptccno);
			                    $(".validfrom").text(validFrom);
			                    $(".validtill").text(validTill);
			                    $(".username").text(responseFromApi.data.lastStageData.customerName);
			                    $(".availLoanLmt").text(
			                        "Rs. " +
			                        addCommaInAmount(
			                            responseFromApi.data.lastStageData.firstTransactionLimit
			                        )
			                    );
			                    $(".totLoanLmt").text(
			                        "Rs. " +
			                        addCommaInAmount(responseFromApi.data.lastStageData.cardLimit)
			                    );
			                    var transactionDetail = {};
			                    transactionDetail.cardLimit =
			                        responseFromApi.data.lastStageData.cardLimit;
			                    transactionDetail.firstTransactionLimit =
			                        responseFromApi.data.lastStageData.firstTransactionLimit;
			                    var enctxn = encryptlocal(JSON.stringify(transactionDetail), pkd);
			                    setCookie("enctxn", enctxn);
			                    var displayOnCard = responseFromApi.data.lastStageData.customerName;
			                    var encryptCustName = encryptlocal(displayOnCard, pkd);
			                    setCookie("displayOnCard", encryptCustName);
			                    var mandRefno = responseFromApi.data.lastStageData.mandateRegNo;
			                    $(".MandRefno").text(mandRefno);
			                    var encryptmandRefno = encryptlocal(mandRefno, pkd);
			                    setCookie("mRefn", encryptmandRefno);
			                    $(".MandDate").text(mandate);
			                    var MandTxnRefNo =
			                        responseFromApi.data.lastStageData.paymentTxnReferenceNumber;
			                    $(".MandTxnRefNo").text(MandTxnRefNo);
			                    var encryptMandTxnRefNo = encryptlocal(MandTxnRefNo, pkd);
			                    setCookie("mTxn", encryptMandTxnRefNo);
			                    $(".Exclusive_Offers_slide").slick("refresh");
			                    $("body").removeAttr("style");
			                } else {
			                    $(".page17").show();
			                    retryScenario = "Submit Otp NTP/PTB Other Stage";
			                    $(".oh_errorPage .error_retry").addClass("gotologin");
			                    $(".oh_errorPage")
			                        .find("p")
			                        .text("An unexpected error occurred. Try again after some time.");
			                }
			            } else if (responseFromApi.data.customerType == "ETB") {
			                setCookie("CType", responseFromApi.data.customerType);

			                if (responseFromApi.data.nextStage == "CPMT") {
			                    $(".page8").show();
			                    $(".trackerMain").hide();
			                    $(".onlyvc").hide();
			                    $(".trackerETB").show();
			                    var docollectflag =
			                        responseFromApi.data.lastStageData.documentCollectionFlag;
			                    if (docollectflag == "Y") {
			                        $(".AddFalse").hide();
			                        $(".AddTrue").show();
			                    }

			                    journeyContinueCreateCookie(responseFromApi);

			                    paymentGatewayURL =
			                        responseFromApi.data.currentStageData.paymentGatewayURL;
			                    paymentGatewayParameters =
			                        responseFromApi.data.currentStageData.paymentGatewayParameters;
			                    payparameter = paymentGatewayParameters;
			                    var fields = payparameter.split("=");
			                    payparameter = fields[1];

			                    var pURL = paymentGatewayURL;
			                    var encryptpURL = encryptlocal(pURL, pkd);
			                    setCookie("pU", encryptpURL);
			                    var pMeter = payparameter;
			                    var encryptpMeter = encryptlocal(pMeter, pkd);
			                    setCookie("pM", encryptpMeter);
			                    var instaCustName = responseFromApi.data.lastStageData.customerName;
			                    var displayOnCard = instaCustName;
			                    var encryptCustName = encryptlocal(displayOnCard, pkd);
			                    setCookie("displayOnCard", encryptCustName);
			                    $(".climit").text(
			                        "Rs. " +
			                        addCommaInAmount(responseFromApi.data.lastStageData.cardLimit)
			                    );

			                    $(".amountpay_RU").html(
			                        "<p><strong>Rs. " +
			                        responseFromApi.data.lastStageData.cardFeeAmount +
			                        '<a><i class="icon-noun_Info" onclick="amtpaytooltip();"></i></a></strong><i>Amount to be paid</i></p>'
			                    );
			                    $("html, body").animate(
			                        {
			                            scrollTop: 0,
			                        },
			                        200
			                    );
			                    $("body").removeAttr("style");
			                } else if (responseFromApi.data.nextStage == "CMND") {
			                    $(".page9").show();
			                    $(".payment_text p").html(
			                        "You have successfully made a payment of <b>Rs. " +
			                        responseFromApi.data.lastStageData.cardFeeAmount +
			                        "</b> towards your joining fee of EMI Network Card."
			                    );
			                    $(".trackerMain").hide();
			                    $(".trackerETB").show();
			                    journeyContinueCreateCookie(responseFromApi);

			                    var cardNumber = responseFromApi.data.lastStageData.cardNumber;

			                    var encryptccno = encryptlocal(cardNumber, pkd);
			                    setCookie("iecn", encryptccno);
			                    mandatePodUrl = responseFromApi.data.currentStageData.mandatePodUrl;
			                    var paymentTxnReferenceNumber =
			                        responseFromApi.data.lastStageData.paymentRefrenceNumber;
			                    $(".txnrefno").text(paymentTxnReferenceNumber);
			                    instaCustName = responseFromApi.data.lastStageData.customerName;
			                    var displayOnCard = instaCustName;
			                    var encryptCustName = encryptlocal(displayOnCard, pkd);
			                    setCookie("displayOnCard", encryptCustName);
			                    $("html, body").animate(
			                        {
			                            scrollTop: 0,
			                        },
			                        200
			                    );
			                    $("body").removeAttr("style");
			                } else if (responseFromApi.data.nextStage == "CPLT") {
			                    $(".page10").show();
			                    $(".onlyVcEtb").hide();
			                    setCookie("VC", "vc");
			                    var qrcheck;
			                    var utmnewCookie = GetCookie("utm_new_cookie");
			                    if (utmnewCookie != null && utmnewCookie != undefined) {
			                        utmnewCookie = JSON.parse(utmnewCookie);
			                        var qrCampaign = utmnewCookie["utm_campaign"];
			                        console.log("utm campaign value : " + qrCampaign);
			                        qrcheck = instaLinkUtmMapping(qrCampaign);
			                        if (qrcheck) {
			                            $(".Exclusive_Offers_slider").html(exclisve);
			                        }
			                    }
			                    var cardNumber = responseFromApi.data.lastStageData.cardNumber;
			                    cardNumber = cardNumber.replace(/.(?=.{4})/g, "X");
			                    $(".cardContant").find("strong").text(cardNumber);
			                    $(".numberside").text(cardNumber);
			                    var encryptccno = encryptlocal(cardNumber, pkd);
			                    setCookie("iecn", encryptccno);
			                    $(".validfrom").text(validFrom);
			                    $(".validtill").text(validTill);
			                    $(".username").text(responseFromApi.data.lastStageData.customerName);
			                    $(".availLoanLmt").text("N/A");
			                    $(".totLoanLmt").text(
			                        "Rs. " +
			                        addCommaInAmount(responseFromApi.data.lastStageData.cardLimit)
			                    );
			                    var transactionDetail = {};
			                    transactionDetail.cardLimit =
			                        responseFromApi.data.lastStageData.cardLimit;
			                    transactionDetail.firstTransactionLimit =
			                        responseFromApi.data.lastStageData.firstTransactionLimit;
			                    var enctxn = encryptlocal(JSON.stringify(transactionDetail), pkd);
			                    setCookie("enctxn", enctxn);
			                    var displayOnCard = responseFromApi.data.lastStageData.customerName;
			                    var encryptCustName = encryptlocal(displayOnCard, pkd);
			                    setCookie("displayOnCard", encryptCustName);
			                    var mandRefno = responseFromApi.data.lastStageData.mandateRegNo;
			                    $(".MandRefno").text(mandRefno);
			                    var encryptmandRefno = encryptlocal(mandRefno, pkd);
			                    setCookie("mRefn", encryptmandRefno);
			                    $(".MandDate").text(mandate);
			                    var MandTxnRefNo =
			                        responseFromApi.data.lastStageData.paymentTxnReferenceNumber;
			                    $(".MandTxnRefNo").text(MandTxnRefNo);
			                    var encryptMandTxnRefNo = encryptlocal(MandTxnRefNo, pkd);
			                    setCookie("mTxn", encryptMandTxnRefNo);
			                    $(".Exclusive_Offers_slide").slick("refresh");
			                    $("body").removeAttr("style");
			                } else if (responseFromApi.data.nextStage == "APLF") {
			                    if (
			                        leadCampaign == "1" &&
			                        leadMedium == "TUN" &&
			                        leadSource == "Partner"
			                    ) {
			                        transunionLeadCaptureInsta(podRequestId, true, true);
			                    }
			                    var currentStageData = responseFromApi.data.currentStageData;
			                    var offerDetails = JSON.parse(currentStageData);
			                    var cardLimit = offerDetails.cardLimit;
			                    var cardFees = offerDetails.cardFees;
			                    var customerName = offerDetails.customerName;
			                    Custdob = offerDetails.dob;

			                    var docollectflag = offerDetails.documentCollectionFlag;
			                    setCookie("dcflag", docollectflag);

			                    if (
			                        (cardLimit != null || cardLimit != "null") &&
			                        (cardFees != null || cardFees != "null") &&
			                        (customerName != null || customerName != "null") &&
			                        (Custdob != null || Custdob != "null")
			                    ) {
			                        $(".page5").show();
			                        $(".trackerMain").hide();
			                        $(".buttonMain").hide();
			                        $(".trackerETB").show();
			                        $(".buttonETB").show();
			                        $(".addonprice").text("Rs. " + addCommaInAmount(cardLimit));
			                        $(".validfrom").text(validFrom);
			                        $(".validtill").text(validTill);
			                        $(".username").text(customerName);
			                        var displayOnCard = customerName;
			                        var encryptCustName = encryptlocal(displayOnCard, pkd);
			                        setCookie("displayOnCard", encryptCustName);
			                        $("html, body").animate(
			                            {
			                                scrollTop: 0,
			                            },
			                            200
			                        );
			                        $("body").removeAttr("style");
			                    } else {
			                        $(".page17").show();
			                        retryScenario = "Submit Otp ETB APLF stage";
			                        $(".oh_errorPage .error_retry").addClass("gotologin");
			                        $(".oh_errorPage")
			                            .find("p")
			                            .text("An unexpected error occurred. Try again after some time.");
			                    }
			                } else if (responseFromApi.data.nextStage == "CCP") {
			                    $(".page17").show();
			                    retryScenario = "Submit Otp ETB CCP stage";
			                    $(".oh_errorPage .error_retry").addClass("gotologin");
			                    $(".oh_errorPage")
			                        .find("p")
			                        .text("An unexpected error occurred. Try again after some time.");
			                } else {
			                    $(".page17").show();
			                    retryScenario = "Submit Otp ETB Other stage";
			                    $(".oh_errorPage .error_retry").addClass("gotologin");
			                    $(".oh_errorPage")
			                        .find("p")
			                        .text("An unexpected error occurred. Try again after some time.");
			                }
			            } else {
			                $(".page17").show();
			                retryScenario = "Submit Otp No customerType";
			                $(".oh_errorPage .error_retry").addClass("gotologin");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("An unexpected error occurred. Try again after some time.");
			            }
			            referID = "OTP Validate";
			            WCMLeadCaptureClick(responseFromApi, url, referID);

			            /* Calling for (offers2) endpoint on 16-JAN-2023 */
			            RBLCaptureInterest();
			        } else if (responseFromApi.data.status == "F") {
			            if (message == "2023") {
			                $(".page16").show();
			                $(".buttonPart_2 .downloadcta").show().text("DOWNLOAD APP");
			                $(".buttonPart_2 .downloadcta").attr(
			                    "onclick",
			                    "window.open('" +
			                    appDownloadCTA("https://bfl.onelink.me/857331112/SAM") +
			                    "','_blank');"
			                );
			                $(".emandate_sorry")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".emandate_sorry")
			                    .find("p")
			                    .text("Unfortunately, we don't have an offer for you right now.");
			                /*if (responseFromApi.data.customerType == "ETB") {
			                          $(".emandate_sorry").find("h2").text("Thank you for showing interest in the EMI Network Card");
			                          $(".emandate_sorry").find("p").text("Unfortunately, we don't have an offer for you right now.");          
			                          $(".iemi_img").hide();
			                          $(".cross_sell_img").show();	 		           
			                        }*/

			                cust_type = responseFromApi.data.customerType;
			                var pageURL = $(location).attr("href");
			                var customer_city = getCookie("tvc_user_city");
			                var utmArray = fetchUtmNewCookie();
			                console.log(utmArray);

			                //var deskImg = ["/sites/bajaj/Insta_Pod_2/images/Group_57173Wallet-2023.svg", "/sites/bajaj/Insta_Pod_2/images/No_Offer_Diwali(2023)festMobilebanner_52023-Appdownload.svg", "/sites/bajaj/Insta_Pod_2/images/NoOffer_Diwali_(2023)festMobilebanner_3CIBIL.svg", "/sites/bajaj/Insta_Pod_2/images/Super_Card_Banner_281x127px_.jpg"];
			                var deskImg = [
			                    "/sites/bajaj/Insta_Pod_2/images/winter_10.png",
			                    "/sites/bajaj/Insta_Pod_2/images/winter_11.png",
			                    "/sites/bajaj/Insta_Pod_2/images/winter_12.png",
			                    "/sites/bajaj/Insta_Pod_2/images/winter_13.png",
			                ];

			                //var mobImg = ["/sites/bajaj/Insta_Pod_2/images/Group_57173Wallet-2023.svg", "/sites/bajaj/Insta_Pod_2/images/No_Offer_Diwali(2023)festMobilebanner_52023-Appdownload.svg", "/sites/bajaj/Insta_Pod_2/images/NoOffer_Diwali_(2023)festMobilebanner_3CIBIL.svg", "/sites/bajaj/Insta_Pod_2/images/SuperCard_Banner_244x92px.jpg"];
			                var mobImg = [
			                    "/sites/bajaj/Insta_Pod_2/images/winter_10.png",
			                    "/sites/bajaj/Insta_Pod_2/images/winter_11.png",
			                    "/sites/bajaj/Insta_Pod_2/images/winter_12.png",
			                    "/sites/bajaj/Insta_Pod_2/images/winter_13.png",
			                ];

			                //var cardLinks = ["https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare&product_code=WCE2&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGNORET&utm_content=N1&utm_term=N2","https://bfl.onelink.me/857331112/SAM?utm_source=" + utmArray[2] + "&utm_medium=" + utmArray[1] + "&utm_campaign=" + utmArray[0], "https://www.bajajfinserv.in/check-free-cibil-score?utm_source=" + utmArray[2] + "&utm_medium=" + utmArray[1] + "&utm_campaign=" + utmArray[0], "https://www.bajajfinserv.in/apply-for-credit-card-online?utm_source=" + utmArray[2] + "&utm_medium=" + utmArray[1] + "&utm_medium=" + utmArray[0]];
			                //var cardLinks = ["https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=" + utmArray[2] + "&utm_medium=" + utmArray[1] + "&utm_campaign=" + utmArray[0] + "&utm_content=N1&utm_term=N2", "https://www.bajajfinserv.in/check-free-cibil-score?utm_source=" + utmArray[2] + "&utm_medium=" + utmArray[1] + "&utm_campaign=" + utmArray[0], "https://www.bajajfinserv.in/apply-for-credit-card-online?utm_source=" + utmArray[2] + "&utm_medium=" + utmArray[1] + "&utm_medium=" + utmArray[0]];
			                var cardLinks = [
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare&product_code=WCE2&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGNORET&utm_content=N1&utm_term=N2",
			                    "https://bfin.in/HWE?%20%20%20utm_source=WEB&utm_medium=SMS&utm_campaign=NOOFFERHWE",
			                    "https://www.bajajfinserv.in/check-free-cibil-score?utm_source=" +
			                    utmArray[2] +
			                    "&utm_medium=" +
			                    utmArray[1] +
			                    "&utm_campaign=" +
			                    utmArray[0],
			                    "https://bfl.onelink.me/857331112/SAM",
			                ];

			                var datalayercall = [
			                    "errorPageBannerDataLayerCall('WalletCare','" +
			                    cust_type +
			                    "','https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGNORET&utm_content=N1&utm_term=N2','" +
			                    pageURL +
			                    "','" +
			                    customer_city +
			                    "','" +
			                    message +
			                    "');",
			                    "errorPageBannerDataLayerCall('CIBILScore','" +
			                    cust_type +
			                    "','https://www.bajajfinserv.in/check-free-cibil-score?utm_source=website&utm_medium=iemic&utm_campaign=lg','" +
			                    pageURL +
			                    "','" +
			                    customer_city +
			                    "','" +
			                    message +
			                    "');",
			                    "errorPageBannerDataLayerCall('CreditCard','" +
			                    cust_type +
			                    "','https://www.bajajfinserv.in/apply-for-credit-card-online?utm_source=E2EInterested&utm_medium=ICross_sell&utm_medium=bfl','" +
			                    pageURL +
			                    "','" +
			                    customer_city +
			                    "','" +
			                    message +
			                    "');",
			                ];

			                var captureInterest = [
			                    "crossSellLeadCaptureClick();",
			                    "crossSellLeadCaptureClick();",
			                    "crossSellLeadCaptureClick();",
			                ];

			                var carBlock = "";

			                var currentStageData = responseFromApi.data.currentStageData;

			                var offers = JSON.parse(currentStageData);
			                if (offers != null && offers != "null") {
			                    if (offers.hasOwnProperty("offerData")) {
			                        var offerDetails = offers.offerData;
			                        //general card

			                        carBlock =
			                            '<div class="Exclusive_Offers_padd WalletCare"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                            captureInterest[0] +
			                            '" href="' +
			                            cardLinks[0] +
			                            '" class="fordesktop" target="_blank"><img src="' +
			                            deskImg[0] +
			                            '" alt="" onclick="' +
			                            datalayercall[0] +
			                            '" loading="lazy"> </a><a onclick="' +
			                            captureInterest[0] +
			                            '" href="' +
			                            cardLinks[0] +
			                            '" class="formobile" target="_blank"><img src="' +
			                            mobImg[0] +
			                            '" alt="" onclick="' +
			                            datalayercall[0] +
			                            '" loading="lazy"> </a></div></div>';
			                        $(".displayViaLoop").append(carBlock);

			                        carBlock =
			                            '<div class="Exclusive_Offers_padd noofferdiwali"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                            captureInterest[1] +
			                            '" href="' +
			                            cardLinks[1] +
			                            '" class="fordesktop" target="_blank"><img src="' +
			                            deskImg[1] +
			                            '" alt="" onclick="' +
			                            datalayercall[1] +
			                            '" loading="lazy"> </a><a onclick="' +
			                            captureInterest[1] +
			                            '" href="' +
			                            cardLinks[1] +
			                            '" class="formobile" target="_blank"><img src="' +
			                            mobImg[1] +
			                            '" alt="" onclick="' +
			                            datalayercall[1] +
			                            '" loading="lazy"> </a></div></div>';
			                        $(".displayViaLoop").append(carBlock);

			                        carBlock =
			                            '<div class="Exclusive_Offers_padd CIBILScore"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                            captureInterest[2] +
			                            '" href="' +
			                            cardLinks[2] +
			                            '" class="fordesktop" target="_blank"><img src="' +
			                            deskImg[2] +
			                            '" alt="" onclick="' +
			                            datalayercall[2] +
			                            '" loading="lazy"> </a><a onclick="' +
			                            captureInterest[2] +
			                            '" href="' +
			                            cardLinks[2] +
			                            '" class="formobile" target="_blank"><img src="' +
			                            mobImg[2] +
			                            '" alt="" onclick="' +
			                            datalayercall[2] +
			                            '" loading="lazy"> </a></div></div>';
			                        $(".displayViaLoop").append(carBlock);

			                        carBlock =
			                            '<div class="Exclusive_Offers_padd DownloadApp"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                            captureInterest[2] +
			                            '" href="' +
			                            cardLinks[3] +
			                            '" class="fordesktop" target="_blank"><img src="' +
			                            deskImg[3] +
			                            '" alt="" onclick="' +
			                            datalayercall[2] +
			                            '" loading="lazy"> </a><a onclick="' +
			                            captureInterest[2] +
			                            '" href="' +
			                            cardLinks[3] +
			                            '" class="formobile" target="_blank"><img src="' +
			                            mobImg[3] +
			                            '" alt="" onclick="' +
			                            datalayercall[2] +
			                            '" loading="lazy"> </a></div></div>';
			                        $(".displayViaLoop").append(carBlock);

			                        $(".Exclusive_Offers_slide_3").slick("refresh");

			                        for (var i = 0; i < offerDetails.length; i++) {
			                            var obj = offerDetails[i];

			                            if (obj.hasOwnProperty("icorsOfferType")) {
			                                if (obj.icorsOfferType == "credit_card") {
			                                    carBlock =
			                                        '<div class="Exclusive_Offers_padd CreditCard"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                                        captureInterest[2] +
			                                        '" href="' +
			                                        cardLinks[2] +
			                                        '" class="fordesktop" target="_blank"><img src="' +
			                                        deskImg[2] +
			                                        '" alt="" onclick="' +
			                                        datalayercall[2] +
			                                        '" loading="lazy"> </a><a onclick="' +
			                                        captureInterest[2] +
			                                        '" href="' +
			                                        cardLinks[2] +
			                                        '" class="formobile" target="_blank"><img src="' +
			                                        mobImg[2] +
			                                        '" alt="" onclick="' +
			                                        datalayercall[2] +
			                                        '" loading="lazy"> </a></div></div>';

			                                    $(".displayViaLoop").append(carBlock);
			                                    $(".Exclusive_Offers_slide_3").slick("refresh");
			                                }
			                            }
			                        }
			                    } else {
			                        carBlock =
			                            '<div class="Exclusive_Offers_padd WalletCare"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                            captureInterest[0] +
			                            '" href="' +
			                            cardLinks[0] +
			                            '" class="fordesktop" target="_blank"><img src="' +
			                            deskImg[0] +
			                            '" alt="" onclick="' +
			                            datalayercall[0] +
			                            '" loading="lazy"> </a><a onclick="' +
			                            captureInterest[0] +
			                            '" href="' +
			                            cardLinks[0] +
			                            '" class="formobile" target="_blank"><img src="' +
			                            mobImg[0] +
			                            '" alt="" onclick="' +
			                            datalayercall[0] +
			                            '" loading="lazy"> </a></div></div>';
			                        $(".displayViaLoop").append(carBlock);

			                        carBlock =
			                            '<div class="Exclusive_Offers_padd noofferdiwali"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                            captureInterest[1] +
			                            '" href="' +
			                            cardLinks[1] +
			                            '" class="fordesktop" target="_blank"><img src="' +
			                            deskImg[1] +
			                            '" alt="" onclick="' +
			                            datalayercall[1] +
			                            '" loading="lazy"> </a><a onclick="' +
			                            captureInterest[1] +
			                            '" href="' +
			                            cardLinks[1] +
			                            '" class="formobile" target="_blank"><img src="' +
			                            mobImg[1] +
			                            '" alt="" onclick="' +
			                            datalayercall[1] +
			                            '" loading="lazy"> </a></div></div>';
			                        $(".displayViaLoop").append(carBlock);

			                        carBlock =
			                            '<div class="Exclusive_Offers_padd CIBILScore"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                            captureInterest[2] +
			                            '" href="' +
			                            cardLinks[2] +
			                            '" class="fordesktop" target="_blank"><img src="' +
			                            deskImg[2] +
			                            '" alt="" onclick="' +
			                            datalayercall[2] +
			                            '" loading="lazy"> </a><a onclick="' +
			                            captureInterest[2] +
			                            '" href="' +
			                            cardLinks[2] +
			                            '" class="formobile" target="_blank"><img src="' +
			                            mobImg[2] +
			                            '" alt="" onclick="' +
			                            datalayercall[2] +
			                            '" loading="lazy"> </a></div></div>';
			                        $(".displayViaLoop").append(carBlock);

			                        carBlock =
			                            '<div class="Exclusive_Offers_padd DownloadApp"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                            captureInterest[2] +
			                            '" href="' +
			                            cardLinks[3] +
			                            '" class="fordesktop" target="_blank"><img src="' +
			                            deskImg[3] +
			                            '" alt="" onclick="' +
			                            datalayercall[2] +
			                            '" loading="lazy"> </a><a onclick="' +
			                            captureInterest[2] +
			                            '" href="' +
			                            cardLinks[3] +
			                            '" class="formobile" target="_blank"><img src="' +
			                            mobImg[3] +
			                            '" alt="" onclick="' +
			                            datalayercall[2] +
			                            '" loading="lazy"> </a></div></div>';
			                        $(".displayViaLoop").append(carBlock);

			                        $(".Exclusive_Offers_slide_3").slick("refresh");
			                    }
			                }
			            } else if (
			                message == "1919" &&
			                responseFromApi.data.customerType == "ETB"
			            ) {
			                $(".page22").show();
			                
			                    //For Banner
			                     
			                $(".page22 .bannerUrlOneNine").attr(
				                    "href",
				                    appDownloadCTA("https://bfl.onelink.me/857331112/SAM2")
				                );
				                
				                // For CTA
				                
			                $(".buttonPart_1 .downloadcta").attr(
				                    "onclick",
				                    "window.open('" +
				                    appDownloadCTA("https://bfl.onelink.me/857331112/SAM2") +
				                    "','_blank');"
				                );
			                
			                $(".wlcmSlider").slick("refresh");
			            } else if (
			                message == "1920" &&
			                responseFromApi.data.customerType == "ETB"
			            ) {
			                cust_type = responseFromApi.data.customerType;
			                var currentstage = responseFromApi.data.currentStageData;
			                console.log("current stage :" + currentstage);
			                var flag = JSON.parse(currentstage);
			                var getDocFlag = flag.documentCollectionFlag;
			                console.log("getdocflag :" + getDocFlag);
			                var qrcheck;
			                var utmnewCookie = GetCookie("utm_new_cookie");
			                if (utmnewCookie != null && utmnewCookie != undefined) {
			                    utmnewCookie = JSON.parse(utmnewCookie);
			                    var qrCampaign = utmnewCookie["utm_campaign"];
			                    console.log("utm campaign value : " + qrCampaign);
			                    qrcheck = instaLinkUtmMapping(qrCampaign);
			                }
			                if (qrcheck) {
			                    $(".page16").show();
			                    $(".emandate_sorry").find("h2").text("Welcome back");
			                    $(".emandate_sorry")
			                        .find("p")
			                        .html(
			                            "You already have an EMI Card. Start shopping at your nearest store by clicking on 'Store Locator' for your favorite products and pay in easy EMIs."
			                        );
			                    $(".page16 .fixedtoMob1 .Exclusive_Offers").hide();
			                    $(".buttonPart_2 .storelocinsta").show();
			                } else {
			                    if (getDocFlag == "N") {
			                        $(".page16").show();
			                        $(".emandate_sorry").find("h2").text("Welcome back");
			                        $(".emandate_sorry")
			                            .find("p")
			                            .html(
			                                "You already have an EMI Network Card. Start shopping online for your favourite products and pay in easy EMIs."
			                            );
			                        $(".page16 .fixedtoMob1 .Exclusive_Offers").hide();
			                        $(".etb_carded").show();
			                        $(".shopOnSlider").slick("refresh");
			                        $(".buttonPart_2").hide();
			                    } else if (getDocFlag == "Y"){ 
			                        creditCardETBActive(flag);
			                    }
			                }
			            } else if (message == "1096") {
			                $(".page16").show();
			                $(".emandate_sorry").find("h2").text("Welcome back");
			                $(".emandate_sorry")
			                    .find("p")
			                    .text(
			                        "You already have an EMI Network Card. Start shopping online for your favourite products and pay in easy EMIs."
			                    );
			                $(".page16 .fixedtoMob1 .Exclusive_Offers").hide();
			                $(".etb_carded").show();
			                $(".shopOnSlider").slick("refresh");
			            } else if (
			                message == "1005" ||
			                message == "1006" ||
			                message == "1004" ||
			                message == "1010" ||
			                message == "1012" ||
			                message == "1016" ||
			                message == "1018" ||
			                message == "1049" ||
			                message == "1080" ||
			                message == "1091" ||
			                message == "2001" ||
			                message == "2006" ||
			                message == "2009" ||
			                message == "2065"
			            ) {
			                $(".page17").show();
			                retryScenario = "Submit Otp F " + message;
			                $(".oh_errorPage .error_retry").addClass("gotologin");
			                apiErrorHandlings(message, url, null);
			            } else if (message == "2002") {
			                apiErrorHandlings(message, url, null);
			            } else if (message == "1051" || message == "1099") {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing your interest in the Insta EMI Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("You're currently not eligible for this offer.");
			                $(".oh_errorPage > a").hide();
			            } else if (message == "1056" || message == "1058" || message == "1039") {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text(
			                        "We are unable to process your application at the moment. To shop on easy EMIs, visit our partner store near you."
			                    );
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Exclusive offer for you. Buy Wallet Care and secure your debit/credit cards with coverage up to Rs. 2 lacs. Also get an annual Zee5 subscription for free."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("AVAIL OFFER");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGPRL&utm_content=PR1&utm_term=PR2"
			                );
			            } else if (
			                message == "1032" ||
			                message == "1035" ||
			                message == "1040" ||
			                message == "1041" ||
			                message == "1042" ||
			                message == "2052"
			            ) {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, your KYC details couldn't be verified. You could, however, proceed with your KYC submission at our nearest partner store. Download App and explore other financial services on the go."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("DOWNLOAD APP");
			                //$(".oh_errorPage .otheroptioncta").attr("href", "https://bfl.onelink.me/857331112/qa4");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    appDownloadCTA("https://bfl.onelink.me/857331112/qa4")
			                );
			            } else if (message == "1090") {
			                $(".page13").show();
			                $(".paymentFailed")
			                    .find("strong")
			                    .text("Rs. " + responseFromApi.data.lastStageData.cardFeeAmount);
			                $(".orderid").text("ORDER ID " + responseFromApi.data.podRequestId);

			                podRequestId = responseFromApi.data.podRequestId;
			                var encryptpodReqID = encryptlocal(podRequestId, pkd);
			                setCookie("pRI", encryptpodReqID);

			                var newAddressUpdate =
			                    responseFromApi.data.lastStageData.newAddressToBeUpdated;
			                if (newAddressUpdate == undefined || newAddressUpdate == null) {
			                    newAddressUpdate = "false";
			                } else {
			                    newAddressUpdate = newAddressUpdate;
			                }
			                setCookie("nAtbUp", newAddressUpdate);

			                $(".faileddate").text(mandate);

			                var paytxnno = responseFromApi.data.lastStageData.paymentRefrenceNumber;
			                if (paytxnno == "null" || paytxnno == null || paytxnno == undefined) {
			                    $(".txnno").text("N/A");
			                } else {
			                    $(".txnno").text(paytxnno);
			                }

			                var transactionDetail = {};
			                transactionDetail.cardLimit =
			                    responseFromApi.data.lastStageData.cardLimit;
			                transactionDetail.cardFeeAmount =
			                    responseFromApi.data.lastStageData.cardFeeAmount;
			                transactionDetail.firstTransactionLimit =
			                    responseFromApi.data.lastStageData.firstTransactionLimit;
			                var enctxn = encryptlocal(JSON.stringify(transactionDetail), pkd);
			                setCookie("enctxn", enctxn);
			                var displayOnCard = responseFromApi.data.lastStageData.customerName;
			                var encryptCustName = encryptlocal(displayOnCard, pkd);
			                setCookie("displayOnCard", encryptCustName);
			                paymentGatewayURL =
			                    responseFromApi.data.currentStageData.paymentGatewayURL;
			                paymentGatewayParameters =
			                    responseFromApi.data.currentStageData.paymentGatewayParameters;
			                payparameter = paymentGatewayParameters;
			                var fields = payparameter.split("=");
			                payparameter = fields[1];

			                var pURL = paymentGatewayURL;
			                var encryptpURL = encryptlocal(pURL, pkd);
			                setCookie("pU", encryptpURL);
			                var pMeter = payparameter;
			                var encryptpMeter = encryptlocal(pMeter, pkd);
			                setCookie("pM", encryptpMeter);
			                $("html, body").animate(
			                    {
			                        scrollTop: 0,
			                    },
			                    200
			                );
			                $("body").removeAttr("style");
			            }
			            //BRE error codes OTPV
			            else if (
			                message == "115" ||
			                message == "402" ||
			                message == "403" ||
			                message == "404" ||
			                message == "405" ||
			                message == "406" ||
			                message == "501" ||
			                message == "502" ||
			                message == "503" ||
			                message == "001" ||
			                message == "002" ||
			                message == "003" ||
			                message == "004" ||
			                message == "005" ||
			                message == "306"
			            ) {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text(
			                        "We are unable to process your application at the moment. To shop on easy EMIs, visit our partner store near you."
			                    );
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Exclusive offer for you. Buy Wallet Care and secure your debit/credit cards with coverage up to Rs. 2 lakh. Also, get an annual Zee5 subscription for free."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("AVAIL OFFER");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGPRL&utm_content=PR1&utm_term=PR2"
			                );
			            } else if (
			                message == "203" ||
			                message == "300" ||
			                message == "301" ||
			                message == "302" ||
			                message == "303" ||
			                message == "304" ||
			                message == "305" ||
			                message == "307" ||
			                message == "308" ||
			                message == "309" ||
			                message == "310" ||
			                message == "311" ||
			                message == "312" ||
			                message == "313" ||
			                message == "314" ||
			                message == "315" ||
			                message == "316" ||
			                message == "317" ||
			                message == "318" ||
			                message == "105" ||
			                message == "401" ||
			                message == "504"
			            ) {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text(
			                        "We are unable to process your application at the moment. To shop on easy EMIs, visit our partner store near you."
			                    );
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Exclusive offer for you. Buy Wallet Care and secure your debit/credit cards with coverage up to Rs. 2 lakh. Also, get an annual Zee5 subscription for free."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("AVAIL OFFER");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGUWRET&utm_content=U1&utm_term=U2"
			                );
			            } else if (message == "204" || message == "504") {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text(
			                        "Thank you for showing your interest in the EMI Network Card. Unfortunately, we do not have an offer for you right now."
			                    );
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "You can also secure your wallet along with an online fraud cover of up to 2 lakhs in just 3 clicks."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("GET IT NOW");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGUWRET&utm_content=U1&utm_term=U2"
			                );
			            } else if (message == "116" || message == "117") {
			                $(".page16").show();
			                $(".emandate_sorry")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".emandate_sorry")
			                    .find("p")
			                    .text("Unfortunately, we don't have an offer for you right now.");
			                $(".buttonPart_2").hide();

			                cust_type = responseFromApi.data.customerType;
			                var pageURL = $(location).attr("href");
			                var customer_city = getCookie("tvc_user_city");
			                var utmArray = fetchUtmNewCookie();
			                //console.log(utmArray);

			                var deskImg = [
			                    "/sites/bajaj/Insta_Pod_2/images/WALLET-CARE-ADAPT-DEKSTOP-281x127.jpg",
			                    "/sites/bajaj/Insta_Pod_2/images/CHR-Thank-you-Banner_281x127.jpg",
			                    "/sites/bajaj/Insta_Pod_2/images/Super_Card_Banner_281x127px_.jpg",
			                ];

			                var mobImg = [
			                    "/sites/bajaj/Insta_Pod_2/images/WALLET-CARE-ADAPT-MOBILE-244x92.jpg",
			                    "/sites/bajaj/Insta_Pod_2/images/CHR-Thank-you-Banner_244x92.jpg",
			                    "/sites/bajaj/Insta_Pod_2/images/SuperCard_Banner_244x92px.jpg",
			                ];

			                var cardLinks = [
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=" +
			                    utmArray[2] +
			                    "&utm_medium=" +
			                    utmArray[1] +
			                    "&utm_campaign=" +
			                    utmArray[0] +
			                    "&utm_content=N1&utm_term=N2",
			                    "https://www.bajajfinserv.in/check-free-cibil-score?utm_source=" +
			                    utmArray[2] +
			                    "&utm_medium=" +
			                    utmArray[1] +
			                    "&utm_campaign=" +
			                    utmArray[0],
			                    "https://www.bajajfinserv.in/apply-for-credit-card-online?utm_source=" +
			                    utmArray[2] +
			                    "&utm_medium=" +
			                    utmArray[1] +
			                    "&utm_medium=" +
			                    utmArray[0],
			                ];

			                var datalayercall = [
			                    "errorPageBannerDataLayerCall('WalletCare','" +
			                    cust_type +
			                    "','https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGUWRET&utm_content=U1&utm_term=U2','" +
			                    pageURL +
			                    "','" +
			                    customer_city +
			                    "','" +
			                    message +
			                    "');",
			                    "errorPageBannerDataLayerCall('CIBILScore','" +
			                    cust_type +
			                    "','https://www.bajajfinserv.in/check-free-cibil-score?utm_source=website&utm_medium=iemic&utm_campaign=lg','" +
			                    pageURL +
			                    "','" +
			                    customer_city +
			                    "','" +
			                    message +
			                    "');",
			                    "errorPageBannerDataLayerCall('CreditCard','" +
			                    cust_type +
			                    "','https://www.bajajfinserv.in/apply-for-credit-card-online?utm_source=E2EInterested&utm_medium=ICross_sell&utm_medium=bfl','" +
			                    pageURL +
			                    "','" +
			                    customer_city +
			                    "','" +
			                    message +
			                    "');",
			                ];

			                var captureInterest = [
			                    "crossSellLeadCaptureClick();",
			                    "crossSellLeadCaptureClick();",
			                    "crossSellLeadCaptureClick();",
			                ];

			                var carBlock = "";

			                var currentStageData = responseFromApi.data.currentStageData;

			                var offers = JSON.parse(currentStageData);
			                if (offers != null && offers != "null") {
			                    if (offers.hasOwnProperty("offerData")) {
			                        var offerDetails = offers.offerData;
			                        //general card

			                        carBlock =
			                            '<div class="Exclusive_Offers_padd WalletCare"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                            captureInterest[0] +
			                            '" href="' +
			                            cardLinks[0] +
			                            '" class="fordesktop" target="_blank"><img src="' +
			                            deskImg[0] +
			                            '" alt="" onclick="' +
			                            datalayercall[0] +
			                            '" loading="lazy"> </a><a onclick="' +
			                            captureInterest[0] +
			                            '" href="' +
			                            cardLinks[0] +
			                            '" class="formobile" target="_blank"><img src="' +
			                            mobImg[0] +
			                            '" alt="" onclick="' +
			                            datalayercall[0] +
			                            '" loading="lazy"> </a></div></div>';
			                        $(".displayViaLoop").append(carBlock);

			                        carBlock =
			                            '<div class="Exclusive_Offers_padd CIBILScore"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                            captureInterest[1] +
			                            '" href="' +
			                            cardLinks[1] +
			                            '" class="fordesktop" target="_blank"><img src="' +
			                            deskImg[1] +
			                            '" alt="" onclick="' +
			                            datalayercall[1] +
			                            '" loading="lazy"> </a><a onclick="' +
			                            captureInterest[1] +
			                            '" href="' +
			                            cardLinks[1] +
			                            '" class="formobile" target="_blank"><img src="' +
			                            mobImg[1] +
			                            '" alt="" onclick="' +
			                            datalayercall[1] +
			                            '" loading="lazy"> </a></div></div>';
			                        $(".displayViaLoop").append(carBlock);

			                        $(".Exclusive_Offers_slide_3").slick("refresh");

			                        for (var i = 0; i < offerDetails.length; i++) {
			                            var obj = offerDetails[i];

			                            if (obj.hasOwnProperty("icorsOfferType")) {
			                                if (obj.icorsOfferType == "credit_card") {
			                                    carBlock =
			                                        '<div class="Exclusive_Offers_padd CreditCard"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                                        captureInterest[2] +
			                                        '" href="' +
			                                        cardLinks[2] +
			                                        '" class="fordesktop" target="_blank"><img src="' +
			                                        deskImg[2] +
			                                        '" alt="" onclick="' +
			                                        datalayercall[2] +
			                                        '" loading="lazy"> </a><a onclick="' +
			                                        captureInterest[2] +
			                                        '" href="' +
			                                        cardLinks[2] +
			                                        '" class="formobile" target="_blank"><img src="' +
			                                        mobImg[2] +
			                                        '" alt="" onclick="' +
			                                        datalayercall[2] +
			                                        '" loading="lazy"> </a></div></div>';

			                                    $(".displayViaLoop").append(carBlock);
			                                    $(".Exclusive_Offers_slide_3").slick("refresh");
			                                }
			                            }
			                        }
			                    } else {
			                        carBlock =
			                            '<div class="Exclusive_Offers_padd WalletCare"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                            captureInterest[0] +
			                            '" href="' +
			                            cardLinks[0] +
			                            '" class="fordesktop" target="_blank"><img src="' +
			                            deskImg[0] +
			                            '" alt="" onclick="' +
			                            datalayercall[0] +
			                            '" loading="lazy"> </a><a onclick="' +
			                            captureInterest[0] +
			                            '" href="' +
			                            cardLinks[0] +
			                            '" class="formobile" target="_blank"><img src="' +
			                            mobImg[0] +
			                            '" alt="" onclick="' +
			                            datalayercall[0] +
			                            '" loading="lazy"> </a></div></div>';
			                        $(".displayViaLoop").append(carBlock);

			                        carBlock =
			                            '<div class="Exclusive_Offers_padd CIBILScore"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                            captureInterest[1] +
			                            '" href="' +
			                            cardLinks[1] +
			                            '" class="fordesktop" target="_blank"><img src="' +
			                            deskImg[1] +
			                            '" alt="" onclick="' +
			                            datalayercall[1] +
			                            '" loading="lazy"> </a><a onclick="' +
			                            captureInterest[1] +
			                            '" href="' +
			                            cardLinks[1] +
			                            '" class="formobile" target="_blank"><img src="' +
			                            mobImg[1] +
			                            '" alt="" onclick="' +
			                            datalayercall[1] +
			                            '" loading="lazy"> </a></div></div>';
			                        $(".displayViaLoop").append(carBlock);

			                        $(".Exclusive_Offers_slide_3").slick("refresh");
			                    }
			                }
			            } else {
			                $(".page17").show();
			                retryScenario = "Submit Otp Other error";
			                $(".oh_errorPage .error_retry").addClass("gotologin");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("An unexpected error occurred. Try again after some time.");
			            }
			        } else {
			            $(".page17").show();
			            retryScenario = "Submit Otp unexpected error";
			            $(".oh_errorPage .error_retry").addClass("gotologin");
			            $(".oh_errorPage")
			                .find("p")
			                .text("An unexpected error occurred. Try again after some time.");
			        }
			    }

			    function ApplFormSuccessManip(responseFromApi, url) {
			        console.log(url);

			        if (
			            responseFromApi.data.status != null &&
			            responseFromApi.data.status != "null" &&
			            responseFromApi.data.message != null &&
			            responseFromApi.data.message != "null" &&
			            responseFromApi.data.message != undefined
			        ) {
			            message = messagesplitter(responseFromApi);
			        }

			        if (responseFromApi.data.status == "P" && message == "1038") {
			            podRequestId = responseFromApi.data.podRequestId;

			            var utmnewCookie = GetCookie("utm_new_cookie");
			            if (utmnewCookie != null && utmnewCookie != undefined) {
			                utmnewCookie = JSON.parse(utmnewCookie);
			                var leadCampaign = utmnewCookie["utm_campaign"];
			                var leadMedium = utmnewCookie["utm_medium"];
			                var leadSource = utmnewCookie["utm_source"];
			                if (
			                    leadCampaign == "1" &&
			                    leadMedium == "TUN" &&
			                    leadSource == "Partner"
			                ) {
			                    transunionLeadCaptureInsta(podRequestId, true, true);
			                }
			            }

			            if (responseFromApi.data.nextStage == "UVC") {
			                newrelic.addPageAction("insta_pod2", {
			                    step: "Application form",
			                    status: "Approved",
			                });

			                $(".page5").show();
			                var cardLimit = responseFromApi.data.cardLimit;
			                var cardFeeAmount = responseFromApi.data.cardFeeAmount;
			                var firstTransactionLimit = responseFromApi.data.firstTransactionLimit;
			                $(".addonprice").text("Rs. " + addCommaInAmount(cardLimit));
			                $(".validfrom").text(validFrom);
			                $(".validtill").text(validTill);
			                $(".username").text(customerFullName);
			                var transactionDetail = {};
			                transactionDetail.cardLimit = cardLimit;
			                transactionDetail.cardFeeAmount = cardFeeAmount;
			                transactionDetail.firstTransactionLimit = firstTransactionLimit;
			                var enctxn = encryptlocal(JSON.stringify(transactionDetail), pkd);
			                setCookie("enctxn", enctxn);
			                var displayOnCard = customerFullName;
			                var encryptCustName = encryptlocal(displayOnCard, pkd);
			                setCookie("displayOnCard", encryptCustName);
			                $("html, body").animate(
			                    {
			                        scrollTop: 0,
			                    },
			                    200
			                );
			                $("body").removeAttr("style");
			            } else {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("An unexpected error occurred. Try again after some time.");
			            }
			            referID = "Form Submission";
			            WCMLeadCaptureClick(responseFromApi, url, referID);
			        } else if (responseFromApi.data.status == "F") { 
			            if (
			                message == "1021" ||
			                message == "1039" ||
			                message == "1040" ||
			                message == "1041" ||
			                message == "1042" ||
			                message == "1049" ||
			                message == "1050" ||
			                message == "1051" ||
			                message == "1056" ||
			                message == "1058" ||
			                message == "1060" ||
			                message == "1061" ||
			                message == "1062" ||
			                message == "1063" ||
			                message == "1099" ||
			                message == "4010" ||
			                message == "4011" ||
			                message == "4012" ||
			                message == "2020"
			            ) {
			                $(".page17").show();
			                apiErrorHandlings(message, url, null);
			            } else if (message == "2070") {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text(
			                        "Thank you for showing interest in Insta EMI Card. Unfortunately, we don't have an offer for you right now."
			                    );
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Exclusive offer for you. Buy Wallet Care and secure your debit/credit cards with coverage up to Rs. 2 lacs. Also get an annual Zee5 subscription for free."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("AVAIL OFFER");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGNORET&utm_content=N1&utm_term=N2"
			                );
			            } else if (message == "2071") {
			                $(".page17").show();
			                retryScenario = "error 2071";
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Unfortunately, we don't have an offer for you right now.");
			            }
			            //BRE error codes UND
			            else if (message == "100") {
			                $(".page17").show();
			                retryScenario = "BRE error 100";
			                $(".oh_errorPage").find("h2").text("Uh-oh! We're unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Invalid details entered, please try again.");
			            } else if (message == "101") {
			                $(".page17").show();
			                retryScenario = "BRE error 100";
			                $(".oh_errorPage").find("h2").text("Uh-oh! We're unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Please enter a valid employment type and retry.");
			            } else if (message == "102") {
			                $(".page17").show();
			                retryScenario = "BRE error 102";
			                $(".oh_errorPage").find("h2").text("Uh-oh! We're unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Please enter a valid occupation type and retry.");
			            } else if (message == "103" || message == "104") {
			                $(".page17").show();
			                retryScenario = "BRE error " + message;
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Unfortunately, we're unable to process your application. To avail of our EMI Finance option, visit our partner store near you."
			                    );
			            } else if (message == "111" || message == "112" || message == "113") {
			                $(".page17").show();
			                retryScenario = "BRE error " + message;
			                $(".oh_errorPage").find("h2").text("Uh-oh! We're unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Invalid details entered, please try again.");
			            } else if (message == "114") {
			                $(".page17_1").show();
			                retryScenario = "BRE error " + message;
			                $(".oh_errorPage").find("h2").text("Assessing your EMI Card Limit");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "We are taking longer than expected.<br> Resuming your EMI Card journey in few seconds."
			                    );
			                timeLoader();
			            } else if (message == "123") {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("We are unable to process your application at the moment");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Download the Bajaj Finserv app and re-apply for the Insta EMI Card."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("DOWNLOAD NOW");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    "https://bfl.onelink.me/857331112/jed"
			                );
			            } else if (message == "201" || message == "202") {
			                $(".page17").show();
			                retryScenario = "BRE error " + message;
			                $(".oh_errorPage").find("h2").text("Uh-oh! We're unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Kindly check the PAN number you've entered and try again.");
			            } else if (message == "204") {
			                $(".page17").show();
			                retryScenario = "BRE error 204";
			                $(".oh_errorPage").find("h2").text("Uh-oh! We're unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			            } else if (message == "701" || message == "702" || message == "703" || message == "704" || message == "705" || message == "706") {
			                $(".page17").show();
			                $(".oh_errorPage").find("h2").text("We are unable to process your application at the moment. To shop on easy EMIs, visit our partner store near you.");
			                $(".oh_errorPage").find("p").text("Exclusive offer for you. Buy Wallet Care and secure your debit/credit cards with coverage up to Rs. 2 lacs. Also get an annual Zee5 subscription for free");
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("AVAIL OFFER");
			                $(".oh_errorPage .otheroptioncta").attr("href", "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGUWRET&utm_content=U1&utm_term=U2");
			            } else if (
			                message == "115" ||
			                message == "116" ||
			                message == "117" ||
			                message == "402" ||
			                message == "403" ||
			                message == "404" ||
			                message == "405" ||
			                message == "406" ||
			                message == "501" ||
			                message == "502" ||
			                message == "503" ||
			                message == "001" ||
			                message == "002" ||
			                message == "003" ||
			                message == "004" ||
			                message == "005" ||
			                message == "306"
			            ) {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text(
			                        "We are unable to process your application at the moment. To shop on easy EMIs, visit our partner store near you."
			                    );
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Exclusive offer for you. Buy Wallet Care and secure your debit/credit cards with coverage up to Rs. 2 lakh. Also, get an annual Zee5 subscription for free."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("AVAIL OFFER");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGPRL&utm_content=PR1&utm_term=PR2"
			                );
			            } else if (
			                message == "203" ||
			                message == "300" ||
			                message == "301" ||
			                message == "302" ||
			                message == "303" ||
			                message == "304" ||
			                message == "305" ||
			                message == "307" ||
			                message == "308" ||
			                message == "309" ||
			                message == "310" ||
			                message == "311" ||
			                message == "312" ||
			                message == "313" ||
			                message == "314" ||
			                message == "315" ||
			                message == "316" ||
			                message == "317" ||
			                message == "318" ||
			                message == "105" ||
			                message == "401" ||
			                message == "504"
			            ) {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text(
			                        "We are unable to process your application at the moment. To shop on easy EMIs, visit our partner store near you."
			                    );
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Exclusive offer for you. Buy Wallet Care and secure your debit/credit cards with coverage up to Rs. 2 lakh. Also, get an annual Zee5 subscription for free."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("AVAIL OFFER");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGUWRET&utm_content=U1&utm_term=U2"
			                );
			            } else {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("An unexpected error occurred. Try again after some time.");
			            }
			        } else {
			            $(".page17").show();
			            $(".oh_errorPage")
			                .find("p")
			                .text("An unexpected error occurred. Try again after some time.");
			        }
			    }

			    function proceedKycSuccessManip(responseFromApi, url) {
			        console.log(url);

			        if (
			            responseFromApi.data.status != null &&
			            responseFromApi.data.status != "null" &&
			            responseFromApi.data.message != null &&
			            responseFromApi.data.message != "null" &&
			            responseFromApi.data.message != undefined
			        ) {
			            message = messagesplitter(responseFromApi);
			        }

			        if (responseFromApi.data.status == "P" && message == "1038") {
			            podRequestId = responseFromApi.data.podRequestId;
			            var encryptpodReqID = encryptlocal(podRequestId, pkd);
			            setCookie("pRI", encryptpodReqID);

			            var ckyc_url = responseFromApi.data.kycPodUrl;

			            if (ckyc_url != "" && ckyc_url != null && ckyc_url != undefined) {
			                window.location.href = ckyc_url;
			            } else {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("An unexpected error occurred. Try again after some time.");
			            }
			            referID = "KYC Initiate";
			            WCMLeadCaptureClick(responseFromApi, url, referID);
			        } else if (responseFromApi.data.status == "F") {
			            if (message == "1023" || message == "1025" || message == "5001") {
			                $(".page17").show();
			                apiErrorHandlings(message, url, null);
			            } else {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("An unexpected error occurred. Try again after some time.");
			            }
			        } else {
			            $(".page17").show();
			            $(".oh_errorPage")
			                .find("p")
			                .text("An unexpected error occurred. Try again after some time.");
			        }
			    }

			    function proceedPayETBSuccessManip(responseFromApi, url) {
			        console.log(url);

			        if (
			            responseFromApi.data.status != null &&
			            responseFromApi.data.status != "null" &&
			            responseFromApi.data.message != null &&
			            responseFromApi.data.message != "null" &&
			            responseFromApi.data.message != undefined
			        ) {
			            message = messagesplitter(responseFromApi);
			        }

			        if (responseFromApi.data.status == "P" && message == "1038") {
			            $(".page8").show();
			            $(".trackerMain").hide();
			            $(".onlyvc").hide();
			            $(".trackerETB").show();
			            var docollectflag = getCookie("dcflag");
			            if (docollectflag == "Y") {
			                $(".AddFalse").hide();
			                $(".AddTrue").show();
			            }

			            podRequestId = responseFromApi.data.podRequestId;
			            var encryptpodReqID = encryptlocal(podRequestId, pkd);
			            setCookie("pRI", encryptpodReqID);

			            paymentGatewayURL = responseFromApi.data.paymentGatewayURL;
			            paymentGatewayParameters = responseFromApi.data.paymentGatewayParameters;
			            payparameter = paymentGatewayParameters;
			            var fields = payparameter.split("=");
			            payparameter = fields[1];

			            var pURL = paymentGatewayURL;
			            var encryptpURL = encryptlocal(pURL, pkd);
			            setCookie("pU", encryptpURL);
			            var pMeter = payparameter;
			            var encryptpMeter = encryptlocal(pMeter, pkd);
			            setCookie("pM", encryptpMeter);

			            var cardLimit = responseFromApi.data.cardLimit;
			            var cardFeeAmount = responseFromApi.data.cardFeeAmount;
			            var firstTransactionLimit = responseFromApi.data.firstTransactionLimit;

			            $(".climit").text("Rs. " + addCommaInAmount(cardLimit));
			            $(".amountpay_RU").html(
			                "<p><strong>Rs. " +
			                cardFeeAmount +
			                '<a><i class="icon-noun_Info" onclick="amtpaytooltip();"></i></a></strong><i>Amount to be paid</i></p>'
			            );

			            var transactionDetail = {};
			            transactionDetail.cardLimit = cardLimit;
			            transactionDetail.cardFeeAmount = cardFeeAmount;
			            transactionDetail.firstTransactionLimit = firstTransactionLimit;
			            var enctxn = encryptlocal(JSON.stringify(transactionDetail), pkd);
			            setCookie("enctxn", enctxn);
			            $("html, body").animate(
			                {
			                    scrollTop: 0,
			                },
			                200
			            );
			            $("body").removeAttr("style");
			            referID = "UND ETB Customer";
			            WCMLeadCaptureClick(responseFromApi, url, referID);
			        } else if (responseFromApi.data.status == "F") {
			            if (
			                message == "1021" ||
			                message == "1039" ||
			                message == "1040" ||
			                message == "1041" ||
			                message == "1042" ||
			                message == "1049" ||
			                message == "1050" ||
			                message == "1051" ||
			                message == "1056" ||
			                message == "1058" ||
			                message == "1060" ||
			                message == "1061" ||
			                message == "1062" ||
			                message == "1063" ||
			                message == "1099" ||
			                message == "4010" ||
			                message == "4011" ||
			                message == "4012"
			            ) {
			                $(".page17").show();
			                apiErrorHandlings(message, url, null);
			            } else if (message == "2070") {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text(
			                        "Thank you for showing interest in Insta EMI Card. Unfortunately, we don't have an offer for you right now."
			                    );
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Exclusive offer for you. Buy Wallet Care and secure your debit/credit cards with coverage up to Rs. 2 lacs. Also get an annual Zee5 subscription for free."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("AVAIL OFFER");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGNORET&utm_content=N1&utm_term=N2"
			                );
			            } else if (message == "2071") {
			                $(".page17").show();
			                retryScenario = "error 2071";
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Unfortunately, we don't have an offer for you right now.");
			            }
			            //BRE error codes UND ETB
			            else if (message == "100") {
			                $(".page17").show();
			                retryScenario = "BRE error 100";
			                $(".oh_errorPage").find("h2").text("Uh-oh! We're unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Invalid details entered, please try again.");
			            } else if (message == "101") {
			                $(".page17").show();
			                retryScenario = "BRE error 101";
			                $(".oh_errorPage").find("h2").text("Uh-oh! We're unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Please enter a valid employment type and retry.");
			            } else if (message == "102") {
			                $(".page17").show();
			                retryScenario = "BRE error 102";
			                $(".oh_errorPage").find("h2").text("Uh-oh! We're unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Please enter a valid occupation type and retry.");
			            } else if (message == "103" || message == "104") {
			                $(".page17").show();
			                retryScenario = "BRE error " + message;
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Unfortunately, we're unable to process your application. To avail of our EMI Finance option, visit our partner store near you."
			                    );
			            } else if (message == "111" || message == "112" || message == "113") {
			                $(".page17").show();
			                retryScenario = "BRE error " + message;
			                $(".oh_errorPage").find("h2").text("Uh-oh! We're unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Invalid details entered, please try again.");
			            } else if (message == "123") {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("We are unable to process your application at the moment");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Download the Bajaj Finserv app and re-apply for the Insta EMI Card."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("DOWNLOAD NOW");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    "https://bfl.onelink.me/857331112/jed"
			                );
			            } else if (message == "201" || message == "202") {
			                $(".page17").show();
			                retryScenario = "BRE error " + message;
			                $(".oh_errorPage").find("h2").text("Uh-oh! We're unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Kindly check the PAN number you've entered and try again.");
			            } else if (message == "204") {
			                $(".page17").show();
			                retryScenario = "BRE error 204";
			                $(".oh_errorPage").find("h2").text("Uh-oh! We're unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			            } else if (
			                message == "115" ||
			                message == "116" ||
			                message == "117" ||
			                message == "402" ||
			                message == "403" ||
			                message == "404" ||
			                message == "405" ||
			                message == "406" ||
			                message == "501" ||
			                message == "502" ||
			                message == "503" ||
			                message == "001" ||
			                message == "002" ||
			                message == "003" ||
			                message == "004" ||
			                message == "005" ||
			                message == "306"
			            ) {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text(
			                        "We are unable to process your application at the moment. To shop on easy EMIs, visit our partner store near you."
			                    );
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Exclusive offer for you. Buy Wallet Care and secure your debit/credit cards with coverage up to Rs. 2 lakh. Also, get an annual Zee5 subscription for free."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("AVAIL OFFER");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGPRL&utm_content=PR1&utm_term=PR2"
			                );
			            } else if (
			                message == "203" ||
			                message == "300" ||
			                message == "301" ||
			                message == "302" ||
			                message == "303" ||
			                message == "304" ||
			                message == "305" ||
			                message == "307" ||
			                message == "308" ||
			                message == "309" ||
			                message == "310" ||
			                message == "311" ||
			                message == "312" ||
			                message == "313" ||
			                message == "314" ||
			                message == "315" ||
			                message == "316" ||
			                message == "317" ||
			                message == "318" ||
			                message == "105" ||
			                message == "401" ||
			                message == "504"
			            ) {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text(
			                        "We are unable to process your application at the moment. To shop on easy EMIs, visit our partner store near you."
			                    );
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Exclusive offer for you. Buy Wallet Care and secure your debit/credit cards with coverage up to Rs. 2 lakh. Also, get an annual Zee5 subscription for free."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("AVAIL OFFER");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGUWRET&utm_content=U1&utm_term=U2"
			                );
			            } else {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("An unexpected error occurred. Try again after some time.");
			            }
			        } else {
			            $(".page17").show();
			            $(".oh_errorPage")
			                .find("p")
			                .text("An unexpected error occurred. Try again after some time.");
			        }
			    }

			    /*function ConfirmKycSuccessManip(responseFromApi, url) {
			        console.log(url);
			  
			        if (responseFromApi.data.status != null && responseFromApi.data.status != "null") {
			          message = messagesplitter(responseFromApi);
			        }
			        if (responseFromApi.data.status == "P" && message == "1038") {
			          if (responseFromApi.data.newAddressToBeUpdated == false) {
			            window._uxa = window._uxa || [];
			            window._uxa.push(["trackPageview", window.location.pathname + window.location.hash.replace("#", "?__") + "?cs-form-step=KYC_SUCCESS"]);
			            newrelic.addPageAction("insta_pod2", { step: "Kyc success", status: "success" });
			            $(".page8").show();
			            var transactionDetail = getCookie("enctxn");
			            if (transactionDetail != null && transactionDetail != undefined && transactionDetail != "") {
			              var decryptTxn = decrypt(transactionDetail, pkd);
			              transactionDetail = decryptTxn.toString(CryptoJS.enc.Utf8);
			              transactionDetail = JSON.parse(transactionDetail);
			            }
			  
			            var docollectflag = responseFromApi.data.documentCollectionFlag;
			            if (docollectflag == "Y") {
			              $(".AddFalse").hide();
			              $(".AddTrue").show();
			            }
			  
			            paymentGatewayURL = responseFromApi.data.paymentGatewayURL;
			            paymentGatewayParameters = responseFromApi.data.paymentGatewayParameters;
			            payparameter = paymentGatewayParameters;
			            var fields = payparameter.split("=");
			            payparameter = fields[1];
			  
			            var pURL = paymentGatewayURL;
			            var encryptpURL = encryptlocal(pURL, pkd);
			            setCookie("pU", encryptpURL);
			            var pMeter = payparameter;
			            var encryptpMeter = encryptlocal(pMeter, pkd);
			            setCookie("pM", encryptpMeter);
			            $(".climit").text("Rs. " + addCommaInAmount(transactionDetail.cardLimit));
			            $(".firsttxnlimit").text("Rs. " + addCommaInAmount(transactionDetail.firstTransactionLimit));
			            $(".amountpay_RU").html("<p><strong>Rs. " + transactionDetail.cardFeeAmount + '<a><i class="icon-noun_Info" onclick="amtpaytooltip();"></i></a></strong><i>Amount to be paid</i></p>');
			            $("html, body").animate({ scrollTop: 0 }, 200);
			            var newAddressUpdate = responseFromApi.data.newAddressToBeUpdated;
			            setCookie("nAtbUp", newAddressUpdate);
			            $("html, body").animate({ scrollTop: 0 }, 200);
			            $("body").removeAttr("style");
			          } else if (responseFromApi.data.newAddressToBeUpdated == true) {
			            window._uxa = window._uxa || [];
			            window._uxa.push(["trackPageview", window.location.pathname + window.location.hash.replace("#", "?__") + "?cs-form-step=KYC_REJECT"]);
			            newrelic.addPageAction("insta_pod2", { step: "Kyc address update", status: "success" });
			            $(".page7").show();
			  
			            var add1 = responseFromApi.data.addressLine1;
			            var add2 = responseFromApi.data.addressLine2;
			            var addpin = responseFromApi.data.addressPin;
			            var addcity = responseFromApi.data.addressCity;
			            var addstate = responseFromApi.data.addressState;
			  
			            if (add1 != undefined || add1 != null || add1 != "null") {
			              $(".page7 #addressform label[for='address_1']").addClass("active");
			              $("#address_1").val(add1);
			            }
			            if (add2 != undefined || add2 != null || add2 != "null") {
			              $(".page7 #addressform label[for='address_2']").addClass("active");
			              $("#address_2").val(add2);
			            }
			            if (addpin != undefined || addpin != null || addpin != "null") {
			              $(".page7 #addressform label[for='pinCode2']").addClass("active");
			              $("#pinCode2").val(addpin);
			            }
			            if (addcity != undefined || addcity != null || addcity != "null") {
			              $(".page7 #addressform label[for='city']").addClass("active");
			              $("#city").val(addcity);
			            }
			            if (addstate != undefined || addstate != null || addstate != "null") {
			              $(".page7 #addressform label[for='state']").addClass("active");
			              $("#state").val(addstate);
			            }
			            $(".proceedbtn").removeAttr("disabled");
			            $(".proceedbtn").addClass("active");
			  
			            var newAddressUpdate = responseFromApi.data.newAddressToBeUpdated;
			            setCookie("nAtbUp", newAddressUpdate);
			            $("html, body").animate({ scrollTop: 0 }, 200);
			            $("body").removeAttr("style");
			          } else {
			            $(".page17").show();
			            $(".oh_errorPage").find("p").text("An unexpected error occurred. Try again after some time.");
			          }
			          referID = "KYC Confirm";
			          WCMLeadCaptureClick(responseFromApi, url, referID);
			        } else if (responseFromApi.data.status == "F") {
			          if (message == "1032" || message == "1035" || message == "1040" || message == "1041" || message == "1042" || message == "2052") {
			            window._uxa = window._uxa || [];
			            window._uxa.push(["trackPageview", window.location.pathname + window.location.hash.replace("#", "?__") + "?cs-form-step=KYC_FAIL"]);
			            $(".page17").show();
			            $(".oh_errorPage").find("h2").text("Thank you for showing interest in the EMI Network Card");
			            $(".oh_errorPage").find("p").text("Sorry, your KYC details couldn't be verified. You could, however, proceed with your KYC submission at our nearest partner store.");
			            $(".oh_errorPage .error_retry").hide();
			            $(".oh_errorPage .error_store_loc").show();
			          } else if (message == "1039") {
			            $(".page17").show();
			            $(".oh_errorPage").find("h2").text("We are unable to process your application at the moment. To shop on easy EMIs, visit our partner store near you.");
			            $(".oh_errorPage").find("p").text("Exclusive offer for you. Buy Wallet Care and secure your debit/credit cards with coverage up to Rs. 2 lacs. Also get an annual Zee5 subscription for free.");
			            $(".oh_errorPage .error_retry").hide();
			            $(".oh_errorPage .otheroptioncta").show().text("AVAIL OFFER");
			            $(".oh_errorPage .otheroptioncta").attr("href", "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGPRL&utm_content=PR1&utm_term=PR2");
			          }
			          //CVC
			          else if (message == "1029" || message == "1030" || message == "2065" || message == "2001" || message == "5001") {
			            $(".page17").show();
			            apiErrorHandlings(message, url, null);
			          } else {
			            $(".page17").show();
			            $(".oh_errorPage").find("p").text("An unexpected error occurred. Try again after some time.");
			          }
			        } else {
			          $(".page17").show();
			          $(".oh_errorPage").find("p").text("An unexpected error occurred. Try again after some time.");
			        }
			      }*/

			    function ConfirmKycSuccessManip(responseFromApi, url) {
			        if (
			            responseFromApi.data.status != null &&
			            responseFromApi.data.status != "null"
			        ) {
			            message = messagesplitter(responseFromApi);
			        }

			        addressStatus = responseFromApi.data.newAddressToBeUpdated;
			        relationshipStatus = responseFromApi.data.updateRelationshipFlag;

			        console.log("AddressUpdateFlag: " + addressStatus);
			        console.log("RelationshipStatusFlag: " + relationshipStatus);
			        if (
			            (addressStatus != undefined && relationshipStatus != undefined) ||
			            (addressStatus != null && relationshipStatus != null) ||
			            (addressStatus != "null" && relationshipStatus != "null")
			        ) {
			            if (responseFromApi.data.status == "P" && message == "1038") {
			                if (addressStatus == false) {
			                    if (relationshipStatus == false) {
			                        window._uxa = window._uxa || [];
			                        window._uxa.push([
			                            "trackPageview",
			                            window.location.pathname +
			                            window.location.hash.replace("#", "?__") +
			                            "?cs-form-step=KYC_SUCCESS",
			                        ]);
			                        newrelic.addPageAction("insta_pod2", {
			                            step: "Kyc success",
			                            status: "success",
			                        });
			                        $(".page8").show();
			                        var transactionDetail = getCookie("enctxn");
			                        if (
			                            transactionDetail != null &&
			                            transactionDetail != undefined &&
			                            transactionDetail != ""
			                        ) {
			                            var decryptTxn = decrypt(transactionDetail, pkd);
			                            transactionDetail = decryptTxn.toString(CryptoJS.enc.Utf8);
			                            transactionDetail = JSON.parse(transactionDetail);
			                        }

			                        var docollectflag = responseFromApi.data.documentCollectionFlag;
			                        if (docollectflag == "Y") {
			                            $(".AddFalse").hide();
			                            $(".AddTrue").show();
			                        }

			                        paymentGatewayURL = responseFromApi.data.paymentGatewayURL;
			                        paymentGatewayParameters =
			                            responseFromApi.data.paymentGatewayParameters;
			                        payparameter = paymentGatewayParameters;
			                        var fields = payparameter.split("=");
			                        payparameter = fields[1];

			                        var pURL = paymentGatewayURL;
			                        var encryptpURL = encryptlocal(pURL, pkd);
			                        setCookie("pU", encryptpURL);
			                        var pMeter = payparameter;
			                        var encryptpMeter = encryptlocal(pMeter, pkd);
			                        setCookie("pM", encryptpMeter);
			                        $(".climit").text(
			                            "Rs. " + addCommaInAmount(transactionDetail.cardLimit)
			                        );
			                        $(".firsttxnlimit").text(
			                            "Rs. " + addCommaInAmount(transactionDetail.firstTransactionLimit)
			                        );
			                        $(".amountpay_RU").html(
			                            "<p><strong>Rs. " +
			                            transactionDetail.cardFeeAmount +
			                            '<a><i class="icon-noun_Info" onclick="amtpaytooltip();"></i></a></strong><i>Amount to be paid</i></p>'
			                        );
			                        $("html, body").animate(
			                            {
			                                scrollTop: 0,
			                            },
			                            200
			                        );
			                        var newAddressUpdate = responseFromApi.data.newAddressToBeUpdated;
			                        setCookie("nAtbUp", newAddressUpdate);
			                        $("html, body").animate(
			                            {
			                                scrollTop: 0,
			                            },
			                            200
			                        );
			                        $("body").removeAttr("style");
			                    } else {
			                        window._uxa = window._uxa || [];
			                        window._uxa.push([
			                            "trackPageview",
			                            window.location.pathname +
			                            window.location.hash.replace("#", "?__") +
			                            "?cs-form-step=KYC_REJECT",
			                        ]);
			                        newrelic.addPageAction("insta_pod2", {
			                            step: "Kyc address update",
			                            status: "success",
			                        });
			                        $(".page7").show();
			                        $(".bookCon_2").hide();
			                        $(".address_status").hide();

			                        $(".proceedbtn").removeAttr("disabled");
			                        $(".proceedbtn").addClass("active");
			                        console.log("confirmkyc address false relation true");
			                        var newAddressUpdate = responseFromApi.data.newAddressToBeUpdated;
			                        setCookie("nAtbUp", newAddressUpdate);
			                        $("html, body").animate(
			                            {
			                                scrollTop: 0,
			                            },
			                            200
			                        );
			                        $("body").removeAttr("style");
			                    }
			                } else if (addressStatus == true) {
			                    window._uxa = window._uxa || [];
			                    window._uxa.push([
			                        "trackPageview",
			                        window.location.pathname +
			                        window.location.hash.replace("#", "?__") +
			                        "?cs-form-step=KYC_REJECT",
			                    ]);
			                    newrelic.addPageAction("insta_pod2", {
			                        step: "Kyc address update",
			                        status: "success",
			                    });
			                    $(".page7").show();
			                    if (relationshipStatus == false) {
			                        $(".relation_status").hide();
			                        $("#mother").prop("checked", false);
			                    }
			                    $(".proceedbtn").removeAttr("disabled");
			                    $(".proceedbtn").addClass("active");
			                    console.log("confirmkyc address true relation true");
			                    var newAddressUpdate = responseFromApi.data.newAddressToBeUpdated;
			                    setCookie("nAtbUp", newAddressUpdate);
			                    $("html, body").animate(
			                        {
			                            scrollTop: 0,
			                        },
			                        200
			                    );
			                    $("body").removeAttr("style");
			                }
			            } else {
			                console.log("Response not null Status not P");
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("An unexpected error occurred. Try again after some time.");
			            }
			            referID = "KYC Confirm";
			            WCMLeadCaptureClick(responseFromApi, url, referID);
			        } else if (responseFromApi.data.status == "F") {
			            if (
			                message == "1032" ||
			                message == "1035" ||
			                message == "1040" ||
			                message == "1041" ||
			                message == "1042" ||
			                message == "2052"
			            ) {
			                window._uxa = window._uxa || [];
			                window._uxa.push([
			                    "trackPageview",
			                    window.location.pathname +
			                    window.location.hash.replace("#", "?__") +
			                    "?cs-form-step=KYC_FAIL",
			                ]);
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, your KYC details couldn't be verified. You could, however, proceed with your KYC submission at our nearest partner store. Download App and explore other financial services on the go."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("DOWNLOAD APP");
			                //$(".oh_errorPage .otheroptioncta").attr("href", "https://bfl.onelink.me/857331112/qa4");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    appDownloadCTA("https://bfl.onelink.me/857331112/qa4")
			                );
			            } else if (message == "1039") {
			                $(".page17").show();
			                // $(".oh_errorPage").find("h2").text("We are unable to process your application at the moment. To shop on easy EMIs, visit our partner store near you.");
			                // $(".oh_errorPage").find("p").text("Exclusive offer for you. Buy Wallet Care and secure your debit/credit cards with coverage up to Rs. 2 lacs. Also get an annual Zee5 subscription for free.");
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, your KYC details couldn't be verified. You could, however, proceed with your KYC submission at our nearest partner store. Download App and explore other financial services on the go."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("DOWNLOAD APP");
			                // $(".oh_errorPage .otheroptioncta").attr("href", "https://bfl.onelink.me/857331112/qa4");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    appDownloadCTA("https://bfl.onelink.me/857331112/qa4")
			                );
			            }
			            //CVC
			            else if (
			                message == "1029" ||
			                message == "1030" ||
			                message == "2065" ||
			                message == "2001" ||
			                message == "5001"
			            ) {
			                $(".page17").show();
			                apiErrorHandlings(message, url, null);
			            } else {
			                console.log("Status F");
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("An unexpected error occurred. Try again after some time.");
			            }
			        } else {
			            console.log("Response null");
			            $(".page17").show();
			            $(".oh_errorPage")
			                .find("p")
			                .text("An unexpected error occurred. Try again after some time.");
			        }
			    }

			    function UpdatedAddrKycSuccessManip(responseFromApi, url) {
			        console.log("inside updateAddrKycSuccessMa");
			        if (
			            responseFromApi.data.status != null &&
			            responseFromApi.data.status != "null" &&
			            responseFromApi.data.message != null &&
			            responseFromApi.data.message != "null" &&
			            responseFromApi.data.message != undefined
			        ) {
			            message = messagesplitter(responseFromApi);
			        }
			        if (responseFromApi.data.status == "P" && message == "1038") {
			            if (responseFromApi.data.nextStage == "CPMT") {
			                newrelic.addPageAction("insta_pod2", {
			                    step: "Update address",
			                    status: "success",
			                });
			                $(".page8").show();

			                var transactionDetail = getCookie("enctxn");

			                if (
			                    transactionDetail != null &&
			                    transactionDetail != undefined &&
			                    transactionDetail != ""
			                ) {
			                    var decryptTxn = decrypt(transactionDetail, pkd);
			                    transactionDetail = decryptTxn.toString(CryptoJS.enc.Utf8);
			                    transactionDetail = JSON.parse(transactionDetail);
			                }

			                var docollectflag = responseFromApi.data.documentCollectionFlag;
			                if (docollectflag == "Y") {
			                    $(".AddFalse").hide();
			                    $(".AddTrue").show();
			                }

			                paymentGatewayURL = responseFromApi.data.paymentGatewayURL;
			                paymentGatewayParameters =
			                    responseFromApi.data.paymentGatewayParameters;
			                payparameter = paymentGatewayParameters;
			                var fields = payparameter.split("=");
			                payparameter = fields[1];

			                var pURL = paymentGatewayURL;
			                var encryptpURL = encryptlocal(pURL, pkd);
			                setCookie("pU", encryptpURL);
			                var pMeter = payparameter;
			                var encryptpMeter = encryptlocal(pMeter, pkd);
			                setCookie("pM", encryptpMeter);
			                $(".climit").text(
			                    "Rs. " + addCommaInAmount(transactionDetail.cardLimit)
			                );
			                $(".firsttxnlimit").text(
			                    "Rs. " + addCommaInAmount(transactionDetail.firstTransactionLimit)
			                );
			                $(".amountpay_RU").html(
			                    "<p><strong>Rs. " +
			                    transactionDetail.cardFeeAmount +
			                    '<a><i class="icon-noun_Info" onclick="amtpaytooltip();"></i></a></strong><i>Amount to be paid</i></p>'
			                );
			                $("html, body").animate(
			                    {
			                        scrollTop: 0,
			                    },
			                    200
			                );
			                $("body").removeAttr("style");
			            } else {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("An unexpected error occurred. Try again after some time.");
			            }
			            referID = "KYC update address";
			            WCMLeadCaptureClick(responseFromApi, url, referID);
			        } else if (responseFromApi.data.status == "F") {
			            if (
			                message == "1032" ||
			                message == "1035" ||
			                message == "1040" ||
			                message == "1041" ||
			                message == "1042" ||
			                message == "2052"
			            ) {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, your KYC details couldn't be verified. You could, however, proceed with your KYC submission at our nearest partner store. Download App and explore other financial services on the go."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("DOWNLOAD APP");
			                // $(".oh_errorPage .otheroptioncta").attr("href", "https://bfl.onelink.me/857331112/qa4");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    appDownloadCTA("https://bfl.onelink.me/857331112/qa4")
			                );
			            } else if (message == "1039") {
			                $(".page17").show();
			                //$(".oh_errorPage").find("h2").text("We are unable to process your application at the moment. To shop on easy EMIs, visit our partner store near you.");
			                // $(".oh_errorPage").find("p").text("Exclusive offer for you. Buy Wallet Care and secure your debit/credit cards with coverage up to Rs. 2 lacs. Also get an annual Zee5 subscription for free.");
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, your KYC details couldn't be verified. You could, however, proceed with your KYC submission at our nearest partner store. Download App and explore other financial services on the go."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("DOWNLOAD APP");
			                //$(".oh_errorPage .otheroptioncta").attr("href", "https://bfl.onelink.me/857331112/qa4");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    appDownloadCTA("https://bfl.onelink.me/857331112/qa4")
			                );
			            } else if (
			                message == "1034" ||
			                message == "1037" ||
			                message == "2013" ||
			                message == "5001" ||
			                message == "2001"
			            ) {
			                $(".page17").show();
			                apiErrorHandlings(message, url, null);
			            }
			            //BRE error codes CONFIRM KYC Uppdate address CVP
			            else if (message == "100") {
			                $(".page17").show();
			                retryScenario = "BRE error 100";
			                $(".oh_errorPage").find("h2").text("Uh-oh! We're unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Invalid details entered, please try again.");
			            } else if (message == "101") {
			                $(".page17").show();
			                retryScenario = "BRE error 101";
			                $(".oh_errorPage").find("h2").text("Uh-oh! We're unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Please enter a valid employment type and retry.");
			            } else if (message == "102") {
			                $(".page17").show();
			                retryScenario = "BRE error 102";
			                $(".oh_errorPage").find("h2").text("Uh-oh! We're unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Please enter a valid occupation type and retry.");
			            } else if (message == "103" || message == "104") {
			                $(".page17").show();
			                retryScenario = "BRE error " + message;
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Unfortunately, we're unable to process your application. To avail of our EMI Finance option, visit our partner store near you."
			                    );
			            } else if (message == "123") {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("We are unable to process your application at the moment");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Download the Bajaj Finserv app and re-apply for the Insta EMI Card."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("DOWNLOAD NOW");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    "https://bfl.onelink.me/857331112/jed"
			                );
			            } else if (message == "111" || message == "112" || message == "113") {
			                $(".page17").show();
			                retryScenario = "BRE error " + message;
			                $(".oh_errorPage").find("h2").text("Uh-oh! We're unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Invalid details entered, please try again.");
			            } else if (message == "201" || message == "202") {
			                $(".page17").show();
			                retryScenario = "BRE error " + message;
			                $(".oh_errorPage").find("h2").text("Uh-oh! We're unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Kindly check the PAN number you've entered and try again.");
			            } else if (
			                message == "115" ||
			                message == "116" ||
			                message == "117" ||
			                message == "402" ||
			                message == "403" ||
			                message == "404" ||
			                message == "405" ||
			                message == "406" ||
			                message == "501" ||
			                message == "502" ||
			                message == "503" ||
			                message == "001" ||
			                message == "002" ||
			                message == "003" ||
			                message == "004" ||
			                message == "005" ||
			                message == "306"
			            ) {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text(
			                        "We are unable to process your application at the moment. To shop on easy EMIs, visit our partner store near you."
			                    );
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Exclusive offer for you. Buy Wallet Care and secure your debit/credit cards with coverage up to Rs. 2 lakh. Also, get an annual Zee5 subscription for free."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("AVAIL OFFER");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGPRL&utm_content=PR1&utm_term=PR2"
			                );
			            } else if (
			                message == "203" ||
			                message == "300" ||
			                message == "301" ||
			                message == "302" ||
			                message == "303" ||
			                message == "304" ||
			                message == "305" ||
			                message == "307" ||
			                message == "308" ||
			                message == "309" ||
			                message == "310" ||
			                message == "311" ||
			                message == "312" ||
			                message == "313" ||
			                message == "314" ||
			                message == "315" ||
			                message == "316" ||
			                message == "317" ||
			                message == "318" ||
			                message == "105" ||
			                message == "401" ||
			                message == "504"
			            ) {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text(
			                        "We are unable to process your application at the moment. To shop on easy EMIs, visit our partner store near you."
			                    );
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Exclusive offer for you. Buy Wallet Care and secure your debit/credit cards with coverage up to Rs. 2 lakh. Also, get an annual Zee5 subscription for free."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("AVAIL OFFER");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGUWRET&utm_content=U1&utm_term=U2"
			                );
			            } else {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("An unexpected error occurred. Try again after some time.");
			            }
			        } else {
			            $(".page17").show();
			            $(".oh_errorPage")
			                .find("p")
			                .text("An unexpected error occurred. Try again after some time.");
			        }
			    }

			    function PaymentGtwySuccessManip(responseFromApi, url) {
			        if (
			            responseFromApi.data.status != null &&
			            responseFromApi.data.status != "null" &&
			            responseFromApi.data.message != null &&
			            responseFromApi.data.message != "null" &&
			            responseFromApi.data.message != undefined
			        ) {
			            message = messagesplitter(responseFromApi);
			        }
			        if (responseFromApi.data.status == "P" && message == "1038") {
			            window._uxa = window._uxa || [];
			            window._uxa.push([
			                "trackPageview",
			                window.location.pathname +
			                window.location.hash.replace("#", "?__") +
			                "?cs-form-step=PAYMENT_SUCCESS",
			            ]);
			            newrelic.addPageAction("insta_pod2", {
			                step: "Payment success",
			                status: "success",
			            });
			            var custType = getCookie("CType");
			            if (
			                custType != null &&
			                custType != "null" &&
			                custType != "" &&
			                custType != undefined
			            ) {
			                //ETB
			                $(".trackerMain").hide();
			                $(".trackerETB").show();
			            } else {
			                $(".trackerMain").show();
			                $(".trackerETB").hide();
			            }

			            $(".page9").show();
			            var chrcookie = getCookie("insta_chr_Cookie");
			            if (chrcookie != null && chrcookie != "" && chrcookie != undefined) {
			                $(".cibilBanner_wht").show();
			            }
			            var transactionDetail = getCookie("enctxn");
			            if (
			                transactionDetail != null &&
			                transactionDetail != undefined &&
			                transactionDetail != ""
			            ) {
			                var decryptTxn = decrypt(transactionDetail, pkd);
			                transactionDetail = decryptTxn.toString(CryptoJS.enc.Utf8);
			                transactionDetail = JSON.parse(transactionDetail);
			            }

			            $(".payment_text p").html(
			                "You have successfully made a payment of <b>Rs. " +
			                transactionDetail.cardFeeAmount +
			                "</b> towards your joining fee of EMI Network Card."
			            );

			            var cardNumber = responseFromApi.data.cardNumber;
			            var encryptccno = encryptlocal(cardNumber, pkd);
			            setCookie("iecn", encryptccno);
			            mandatePodUrl = responseFromApi.data.mandatePodUrl;
			            var paymentTxnReferenceNumber =
			                responseFromApi.data.paymentTxnReferenceNumber;
			            $(".txnrefno").text(paymentTxnReferenceNumber);

			            $("html, body").animate(
			                {
			                    scrollTop: 0,
			                },
			                200
			            );
			            $("body").removeAttr("style");
			            referID = "Payment Response";
			            WCMLeadCaptureClick(responseFromApi, url, referID);
			        } else if (responseFromApi.data.status == "F") {
			            if (message == "1090") {
			                window._uxa = window._uxa || [];
			                window._uxa.push([
			                    "trackPageview",
			                    window.location.pathname +
			                    window.location.hash.replace("#", "?__") +
			                    "?cs-form-step=PAYMENT_FAILURE",
			                ]);
			                newrelic.addPageAction("insta_pod2", {
			                    step: "Payment failed",
			                    status: "failed",
			                });
			                $(".page13").show();
			                var transactionDetail = getCookie("enctxn");

			                if (
			                    transactionDetail != null &&
			                    transactionDetail != undefined &&
			                    transactionDetail != ""
			                ) {
			                    var decryptTxn = decrypt(transactionDetail, pkd);
			                    transactionDetail = decryptTxn.toString(CryptoJS.enc.Utf8);
			                    transactionDetail = JSON.parse(transactionDetail);
			                }
			                var paymentTxnReferenceNumber;
			                if (!responseFromApi.data.paymentTxnReferenceNumber) {
			                    paymentTxnReferenceNumber = "N/A";
			                } else {
			                    paymentTxnReferenceNumber =
			                        responseFromApi.data.paymentTxnReferenceNumber;
			                }

			                $(".paymentFailed")
			                    .find("strong")
			                    .text("Rs. " + transactionDetail.cardFeeAmount);
			                var prID = responseFromApi.data.podRequestId;
			                if (prID == undefined || prID == null) {
			                    $(".orderid").text("ORDER ID " + "N/A");
			                } else {
			                    $(".orderid").text("ORDER ID " + prID);
			                }

			                var payFailedDate = responseFromApi.data.responseDatetime;
			                var fields = payFailedDate.split("T");
			                var currentdate = fields[0];
			                var currenttime = fields[1];

			                var innerdate = currentdate.split("-");
			                var dd = innerdate[2];
			                var mm = innerdate[1];
			                var yyyy = innerdate[0];
			                innerdate = dd + "/" + mm + "/" + yyyy;

			                var innertime = currenttime.split(":");
			                var hh = innertime[0];
			                var mm = innertime[1];
			                var timemed;
			                if (hh < 12) {
			                    timemed = hh + ":" + mm + " AM";
			                } else {
			                    timemed = hh + ":" + mm + " PM";
			                }
			                payFailedDate = innerdate + " " + timemed;

			                $(".faileddate").text(payFailedDate);
			                $(".txnno").text(paymentTxnReferenceNumber);
			                $("html, body").animate(
			                    {
			                        scrollTop: 0,
			                    },
			                    200
			                );
			                $("body").removeAttr("style");
			            } else if (
			                message == "1091" ||
			                message == "2006" ||
			                message == "2014" ||
			                message == "2001"
			            ) {
			                $(".page17").show();
			                apiErrorHandlings(message, url, null);
			            } else if (message == "1021") {
			                $(".page17").show();
			                retryScenario = "error 1021";
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "CCP Stage Not DONE",
			                });
			            } else if (message == "1921") {
			                $(".page17_2").show();
			                retryScenario = "Payment status pending";
			                // $(".oh_errorPage").find("h2").text("Transaction Pending");
			                // $(".oh_errorPage").find("p").text("Please wait 24 hours before trying to make another payment if money has already been debited from your account.");
			            } else {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("An unexpected error occurred. Try again after some time.");
			            }
			        } else {
			            $(".page17").show();
			            $(".oh_errorPage")
			                .find("p")
			                .text("An unexpected error occurred. Try again after some time.");
			        }
			    }

			    function MandateRegSuccessManip(responseFromApi, url) {
			        if (
			            responseFromApi.data.status != null &&
			            responseFromApi.data.status != "null" &&
			            responseFromApi.data.message != null &&
			            responseFromApi.data.message != "null" &&
			            responseFromApi.data.message != undefined
			        ) {
			            message = messagesplitter(responseFromApi);
			        }

			        if (responseFromApi.data.status == "P" && message == "1038") {
			            window._uxa = window._uxa || [];
			            window._uxa.push([
			                "trackPageview",
			                window.location.pathname +
			                window.location.hash.replace("#", "?__") +
			                "?cs-form-step=EMANDATE_SUCCESS",
			            ]);
			            $(".page10").show();
			            pageReloadIndentifier = "MS-10";
			            setCookie("pRelInd", pageReloadIndentifier);
			            var updateAddress = getCookie("nAtbUp");
			            if (updateAddress == "true") {
			                $(".shopNow").hide();
			                $(".shopOnFull_1").hide();
			            } else {
			                $(".shopNow").show();
			                $(".shopOnFull_1").show();
			            }
			            var qrcheck;
			            var utmnewCookie = GetCookie("utm_new_cookie");
			            if (utmnewCookie != null && utmnewCookie != undefined) {
			                utmnewCookie = JSON.parse(utmnewCookie);
			                var qrCampaign = utmnewCookie["utm_campaign"];
			                console.log("utm campaign value : " + qrCampaign);
			                qrcheck = instaLinkUtmMapping(qrCampaign);
			                if (qrcheck) {
			                    $(".Exclusive_Offers_slider").html(exclisve);
			                }
			            }
			            var ccno = getCookie("iecn");
			            if (ccno != null && ccno != undefined && ccno != "") {
			                var decryptccno = decrypt(ccno, pkd);
			                ccno = decryptccno.toString(CryptoJS.enc.Utf8);
			                ccno = ccno.replace(/.(?=.{4})/g, "X");
			            }
			            var card_display = getCookie("displayOnCard");
			            if (
			                card_display != null &&
			                card_display != undefined &&
			                card_display != ""
			            ) {
			                var decryptCustName = decrypt(card_display, pkd);
			                card_display = decryptCustName.toString(CryptoJS.enc.Utf8);
			            }
			            var transactionDetail = getCookie("enctxn");
			            if (
			                transactionDetail != null &&
			                transactionDetail != undefined &&
			                transactionDetail != ""
			            ) {
			                var decryptTxn = decrypt(transactionDetail, pkd);
			                transactionDetail = decryptTxn.toString(CryptoJS.enc.Utf8);
			                transactionDetail = JSON.parse(transactionDetail);
			            }
			            $(".cardContant").find("strong").text(ccno);
			            $(".numberside").text(ccno);
			            $(".validfrom").text(validFrom);
			            $(".validtill").text(validTill);
			            $(".username").text(card_display);
			            var custType = getCookie("CType");
			            if (
			                custType != null &&
			                custType != "null" &&
			                custType != "" &&
			                custType != undefined
			            ) {
			                //ETB
			                $(".onlyVcEtb").hide();
			                $(".availLoanLmt").text("N/A");
			                setCookie("VC", "vc");
			            } else {
			                $(".availLoanLmt").text(
			                    "Rs. " + addCommaInAmount(transactionDetail.firstTransactionLimit)
			                );
			            }
			            $(".totLoanLmt").text(
			                "Rs. " + addCommaInAmount(transactionDetail.cardLimit)
			            );
			            var mandRefno = responseFromApi.data.mandateRegistrationNumber;
			            $(".MandRefno").text(mandRefno);
			            var encryptmandRefno = encryptlocal(mandRefno, pkd);
			            setCookie("mRefn", encryptmandRefno);
			            $(".MandDate").text(mandate);
			            var MandTxnRefNo = responseFromApi.data.transactionReferenceNumber;
			            $(".MandTxnRefNo").text(MandTxnRefNo);
			            var encryptMandTxnRefNo = encryptlocal(MandTxnRefNo, pkd);
			            setCookie("mTxn", encryptMandTxnRefNo);
			            $(".Exclusive_Offers_slide").slick("refresh");
			            $("body").removeAttr("style");
			            referID = "Mandate Response";
			            WCMLeadCaptureClick(responseFromApi, url, referID);
			        } else if (responseFromApi.data.status == "F") {
			            if (message == "2021") {
			                window._uxa = window._uxa || [];
			                window._uxa.push([
			                    "trackPageview",
			                    window.location.pathname +
			                    window.location.hash.replace("#", "?__") +
			                    "?cs-form-step=EMANDATE_FAILURE",
			                ]);
			                $(".page10_2").show();
			                pageReloadIndentifier = "MF-10";
			                setCookie("pRelInd", pageReloadIndentifier);

			                var ccno = getCookie("iecn");
			                if (ccno != null && ccno != undefined && ccno != "") {
			                    var decryptccno = decrypt(ccno, pkd);
			                    ccno = decryptccno.toString(CryptoJS.enc.Utf8);
			                    ccno = ccno.replace(/.(?=.{4})/g, "X");
			                }
			                var card_display = getCookie("displayOnCard");
			                if (
			                    card_display != null &&
			                    card_display != undefined &&
			                    card_display != ""
			                ) {
			                    var decryptCustName = decrypt(card_display, pkd);
			                    card_display = decryptCustName.toString(CryptoJS.enc.Utf8);
			                }
			                var transactionDetail = getCookie("enctxn");

			                if (
			                    transactionDetail != null &&
			                    transactionDetail != undefined &&
			                    transactionDetail != ""
			                ) {
			                    var decryptTxn = decrypt(transactionDetail, pkd);
			                    transactionDetail = decryptTxn.toString(CryptoJS.enc.Utf8);
			                    transactionDetail = JSON.parse(transactionDetail);
			                }

			                $(".cardContant").find("strong").text(ccno);
			                $(".numberside").text(ccno);
			                $(".validfrom").text(validFrom);
			                $(".validtill").text(validTill);
			                $(".username").text(card_display);
			                var custType = getCookie("CType");
			                if (
			                    custType != null &&
			                    custType != "null" &&
			                    custType != "" &&
			                    custType != undefined
			                ) {
			                    //ETB
			                    $(".onlyVcEtb").hide();
			                    $(".availLoanLmt").text("N/A");
			                    setCookie("VC", "vc");
			                } else {
			                    $(".availLoanLmt").text(
			                        "Rs. " + addCommaInAmount(transactionDetail.firstTransactionLimit)
			                    );
			                }

			                $(".totLoanLmt").text(
			                    "Rs. " + addCommaInAmount(transactionDetail.cardLimit)
			                );
			                $(".Exclusive_Offers_slide").slick("refresh");
			                $("body").removeAttr("style");
			                referID = "Mandate Response";
			                WCMLeadCaptureClick(responseFromApi, url, referID);
			            } else {
			                $(".page17").show();
			                apiErrorHandlings(message, url, responseFromApi);
			            }
			        } else {
			            $(".page17").show();
			            $(".oh_errorPage")
			                .find("p")
			                .text("An unexpected error occurred. Try again after some time.");
			        }
			    }

			    function RetryAgainSuccessManip(responseFromApi, url) {
			        console.log(url);

			        if (
			            responseFromApi.data.status != null &&
			            responseFromApi.data.status != "null" &&
			            responseFromApi.data.message != null &&
			            responseFromApi.data.message != "null" &&
			            responseFromApi.data.message != undefined
			        ) {
			            message = messagesplitter(responseFromApi);
			        }

			        if (
			            responseFromApi.data.status == "P" &&
			            (message == "1038" ||
			                message == "1080" ||
			                message == "1006" ||
			                message == "1005" ||
			                message == "1010" ||
			                message == "1049" ||
			                message == "1004" ||
			                message == "1099" ||
			                message == "1056" ||
			                message == "1035" ||
			                message == "2065" ||
			                message == "2001" ||
			                message == "2052" ||
			                message == "1030" ||
			                message == "1032" ||
			                message == "1039" ||
			                message == "1040" ||
			                message == "1041" ||
			                message == "1042" ||
			                message == "1016" ||
			                message == "1090" ||
			                message == "1091" ||
			                message == "1921" ||
			                message == "2006" ||
			                message == "1018" ||
			                message == "2009")
			        ) {
			            podRequestId = responseFromApi.data.podRequestId;

			            if (
			                responseFromApi.data.customerType == "NTB" ||
			                responseFromApi.data.customerType == "PTB"
			            ) {
			                var instaCustName;
			                setCookie("CType", responseFromApi.data.customerType);

			                if (responseFromApi.data.nextStage == "APLF") {
			                    $(".page3").show();
			                    $("#prodetails_1 .btnstyl").removeClass("clicked");
			                    $("html, body").animate(
			                        {
			                            scrollTop: 0,
			                        },
			                        200
			                    );
			                    $("body").removeAttr("style");
			                } else if (responseFromApi.data.nextStage == "UND") {
			                    $(".page3").show();
			                    $("#prodetails_1 .btnstyl").removeClass("clicked");
			                    $("html, body").animate(
			                        {
			                            scrollTop: 0,
			                        },
			                        200
			                    );
			                    $("body").removeAttr("style");
			                } else if (responseFromApi.data.nextStage == "UVC") {
			                    $(".page5").show();
			                    $(".buttonMain .show6").removeClass("clicked");
			                    $(".buttonETB .show6_ETB").removeClass("clicked");
			                    journeyContinueCreateCookie(responseFromApi);

			                    var cardLimit = responseFromApi.data.lastStageData.cardLimit;
			                    instaCustName = responseFromApi.data.lastStageData.customerName;
			                    $(".addonprice").text("Rs. " + addCommaInAmount(cardLimit));

			                    $(".validfrom").text(validFrom);
			                    $(".validtill").text(validTill);
			                    $(".username").text(instaCustName);
			                    var displayOnCard = instaCustName;
			                    var encryptCustName = encryptlocal(displayOnCard, pkd);
			                    setCookie("displayOnCard", encryptCustName);
			                    $("html, body").animate(
			                        {
			                            scrollTop: 0,
			                        },
			                        200
			                    );
			                    $("body").removeAttr("style");
			                } else if (responseFromApi.data.nextStage == "CVC") {
			                    journeyContinueCreateCookie(responseFromApi);

			                    var ckyc_url = responseFromApi.data.currentStageData.kycPodUrl;

			                    if (ckyc_url != "" && ckyc_url != null && ckyc_url != undefined) {
			                        window.location.href = ckyc_url;
			                    } else {
			                        $(".page17").show();
			                        retryScenario = "CKYC URL not received";
			                        $(".oh_errorPage")
			                            .find("h2")
			                            .text("Oops! There was an unexpected error");
			                        $(".oh_errorPage")
			                            .find("p")
			                            .text(
			                                "We're unable re-direct you to the KYC page. Please try again later"
			                            );
			                    }
			                } else if (responseFromApi.data.nextStage == "CVP") {
			                    journeyContinueCreateCookie(responseFromApi);

			                    $(".page7").show();
			                    $("#addressform .btnstyl").removeClass("clicked");
			                    respFromKycPage = "null";

			                    checkAddressAndRelation(responseFromApi);

			                    /*var add1 = responseFromApi.data.currentStageData.addressLine1;
			                              var add2 = responseFromApi.data.currentStageData.addressLine2;
			                              var addpin = responseFromApi.data.currentStageData.addressPin;
			                              var addcity = responseFromApi.data.currentStageData.addressCity;
			                              var addstate = responseFromApi.data.currentStageData.addressState;
			                              
			                              if (add1 != undefined || add1 != null || add1 != "null") {
			                                $(".page7 #addressform label[for='address_1']").addClass("active");
			                                $("#address_1").val(add1);
			                              }
			                              if (add2 != undefined || add2 != null || add2 != "null") {
			                                $(".page7 #addressform label[for='address_2']").addClass("active");
			                                $("#address_2").val(add2);
			                              }
			                              if (addpin != undefined || addpin != null || addpin != "null") {
			                                $(".page7 #addressform label[for='pinCode2']").addClass("active");
			                                $("#pinCode2").val(addpin);
			                              }
			                              if (addcity != undefined || addcity != null || addcity != "null") {
			                                $(".page7 #addressform label[for='city']").addClass("active");
			                                $("#city").val(addcity);
			                              }
			                              if (addstate != undefined || addstate != null || addstate != "null") {
			                                $(".page7 #addressform label[for='state']").addClass("active");
			                                $("#state").val(addstate);
			                              }*/
			                    $(".proceedbtn").removeAttr("disabled");
			                    $(".proceedbtn").addClass("active");
			                    console.log("below CKYC url CVP");

			                    var newAddressUpdate =
			                        responseFromApi.data.currentStageData.newAddressToBeUpdated;
			                    if (newAddressUpdate == undefined || newAddressUpdate == null) {
			                        newAddressUpdate = "false";
			                    } else {
			                        newAddressUpdate = newAddressUpdate;
			                    }
			                    setCookie("nAtbUp", newAddressUpdate);
			                    $("html, body").animate(
			                        {
			                            scrollTop: 0,
			                        },
			                        200
			                    );
			                    $("body").removeAttr("style");
			                } else if (responseFromApi.data.nextStage == "CPMT") {
			                    $(".page8").show();
			                    journeyContinueCreateCookie(responseFromApi);

			                    paymentGatewayURL =
			                        responseFromApi.data.currentStageData.paymentGatewayURL;
			                    paymentGatewayParameters =
			                        responseFromApi.data.currentStageData.paymentGatewayParameters;
			                    var docollectflag =
			                        responseFromApi.data.lastStageData.documentCollectionFlag;

			                    if (docollectflag == "Y") {
			                        $(".AddFalse").hide();
			                        $(".AddTrue").show();
			                    }
			                    payparameter = paymentGatewayParameters;
			                    var fields = payparameter.split("=");
			                    payparameter = fields[1];
			                    var pURL = paymentGatewayURL;
			                    var encryptpURL = encryptlocal(pURL, pkd);
			                    setCookie("pU", encryptpURL);
			                    var pMeter = payparameter;
			                    var encryptpMeter = encryptlocal(pMeter, pkd);
			                    setCookie("pM", encryptpMeter);
			                    var updateAddress =
			                        responseFromApi.data.lastStageData.newAddressToBeUpdated;

			                    if (updateAddress == undefined || updateAddress == null) {
			                        updateAddress = "false";
			                    } else {
			                        updateAddress = updateAddress;
			                    }

			                    setCookie("nAtbUp", updateAddress);

			                    $(".climit").text(
			                        "Rs. " +
			                        addCommaInAmount(responseFromApi.data.lastStageData.cardLimit)
			                    );
			                    $(".firsttxnlimit").text(
			                        "Rs. " +
			                        addCommaInAmount(
			                            responseFromApi.data.lastStageData.firstTransactionLimit
			                        )
			                    );
			                    $(".amountpay_RU").html(
			                        "<p><strong>Rs. " +
			                        responseFromApi.data.lastStageData.cardFeeAmount +
			                        '<a><i class="icon-noun_Info" onclick="amtpaytooltip();"></i></a></strong><i>Amount to be paid</i></p>'
			                    );
			                    $("html, body").animate(
			                        {
			                            scrollTop: 0,
			                        },
			                        200
			                    );
			                    $("body").removeAttr("style");
			                } else if (responseFromApi.data.nextStage == "CMND") {
			                    $(".page9").show();
			                    $(".payment_text p").html(
			                        "You have successfully made a payment of <b>Rs. " +
			                        responseFromApi.data.lastStageData.cardFeeAmount +
			                        "</b> towards your joining fee of EMI Network Card."
			                    );

			                    $(".trackerMain").show();
			                    $(".trackerETB").hide();
			                    journeyContinueCreateCookie(responseFromApi);

			                    var cardNumber = responseFromApi.data.lastStageData.cardNumber;
			                    var encryptccno = encryptlocal(cardNumber, pkd);
			                    setCookie("iecn", encryptccno);
			                    var updateAddress =
			                        responseFromApi.data.lastStageData.newAddressToBeUpdated;
			                    if (updateAddress == undefined || updateAddress == null) {
			                        updateAddress = "false";
			                    } else {
			                        updateAddress = updateAddress;
			                    }
			                    setCookie("nAtbUp", updateAddress);

			                    mandatePodUrl = responseFromApi.data.currentStageData.mandatePodUrl;
			                    var paymentTxnReferenceNumber =
			                        responseFromApi.data.lastStageData.paymentRefrenceNumber;
			                    $(".txnrefno").text(paymentTxnReferenceNumber);
			                    instaCustName = responseFromApi.data.lastStageData.customerName;
			                    var displayOnCard = instaCustName;
			                    var encryptCustName = encryptlocal(displayOnCard, pkd);
			                    setCookie("displayOnCard", encryptCustName);
			                    $("html, body").animate(
			                        {
			                            scrollTop: 0,
			                        },
			                        200
			                    );
			                    $("body").removeAttr("style");
			                } else if (responseFromApi.data.nextStage == "CPLT") {
			                    $(".page10").show();
			                    pageReloadIndentifier = "MS-10";
			                    setCookie("pRelInd", pageReloadIndentifier);
			                    var updateAddress =
			                        responseFromApi.data.lastStageData.newAddressToBeUpdated;

			                    if (updateAddress == "true") {
			                        $(".shopNow").hide();
			                        $(".shopOnFull_1").hide();
			                    } else {
			                        $(".shopNow").show();
			                        $(".shopOnFull_1").show();
			                    }
			                    setCookie("nAtbUp", updateAddress);
			                    var qrcheck;
			                    var utmnewCookie = GetCookie("utm_new_cookie");
			                    if (utmnewCookie != null && utmnewCookie != undefined) {
			                        utmnewCookie = JSON.parse(utmnewCookie);
			                        var qrCampaign = utmnewCookie["utm_campaign"];
			                        console.log("utm campaign value : " + qrCampaign);
			                        qrcheck = instaLinkUtmMapping(qrCampaign);
			                        if (qrcheck) {
			                            $(".Exclusive_Offers_slider").html(exclisve);
			                        }
			                    }
			                    var cardNumber = responseFromApi.data.lastStageData.cardNumber;
			                    cardNumber = cardNumber.replace(/.(?=.{4})/g, "X");
			                    $(".cardContant").find("strong").text(cardNumber);
			                    $(".numberside").text(cardNumber);
			                    var encryptccno = encryptlocal(cardNumber, pkd);
			                    setCookie("iecn", encryptccno);

			                    $(".validfrom").text(validFrom);
			                    $(".validtill").text(validTill);
			                    $(".username").text(responseFromApi.data.lastStageData.customerName);
			                    $(".availLoanLmt").text(
			                        "Rs. " +
			                        addCommaInAmount(
			                            responseFromApi.data.lastStageData.firstTransactionLimit
			                        )
			                    );
			                    $(".totLoanLmt").text(
			                        "Rs. " +
			                        addCommaInAmount(responseFromApi.data.lastStageData.cardLimit)
			                    );

			                    var transactionDetail = {};
			                    transactionDetail.cardLimit =
			                        responseFromApi.data.lastStageData.cardLimit;
			                    transactionDetail.firstTransactionLimit =
			                        responseFromApi.data.lastStageData.firstTransactionLimit;
			                    var enctxn = encryptlocal(JSON.stringify(transactionDetail), pkd);
			                    setCookie("enctxn", enctxn);

			                    var displayOnCard = responseFromApi.data.lastStageData.customerName;
			                    var encryptCustName = encryptlocal(displayOnCard, pkd);
			                    setCookie("displayOnCard", encryptCustName);

			                    var mandRefno = responseFromApi.data.lastStageData.mandateRegNo;
			                    $(".MandRefno").text(mandRefno);
			                    var encryptmandRefno = encryptlocal(mandRefno, pkd);
			                    setCookie("mRefn", encryptmandRefno);
			                    $(".MandDate").text(mandate);

			                    var MandTxnRefNo =
			                        responseFromApi.data.lastStageData.paymentTxnReferenceNumber;
			                    $(".MandTxnRefNo").text(MandTxnRefNo);
			                    var encryptMandTxnRefNo = encryptlocal(MandTxnRefNo, pkd);
			                    setCookie("mTxn", encryptMandTxnRefNo);
			                    $(".Exclusive_Offers_slide").slick("refresh");
			                    $("body").removeAttr("style");
			                } else {
			                    $(".page17").show();
			                    $(".oh_errorPage")
			                        .find("p")
			                        .text("An unexpected error occurred. Try again after some time.");
			                }
			            } else if (responseFromApi.data.customerType == "ETB") {
			                setCookie("CType", responseFromApi.data.customerType);

			                if (responseFromApi.data.nextStage == "CPMT") {
			                    $(".page8").show();
			                    $(".trackerMain").hide();
			                    $(".onlyvc").hide();
			                    $(".trackerETB").show();
			                    var docollectflag =
			                        responseFromApi.data.lastStageData.documentCollectionFlag;
			                    if (docollectflag == "Y") {
			                        $(".AddFalse").hide();
			                        $(".AddTrue").show();
			                    }

			                    journeyContinueCreateCookie(responseFromApi);

			                    paymentGatewayURL =
			                        responseFromApi.data.currentStageData.paymentGatewayURL;
			                    paymentGatewayParameters =
			                        responseFromApi.data.currentStageData.paymentGatewayParameters;
			                    payparameter = paymentGatewayParameters;
			                    var fields = payparameter.split("=");
			                    payparameter = fields[1];

			                    var pURL = paymentGatewayURL;
			                    var encryptpURL = encryptlocal(pURL, pkd);
			                    setCookie("pU", encryptpURL);
			                    var pMeter = payparameter;
			                    var encryptpMeter = encryptlocal(pMeter, pkd);
			                    setCookie("pM", encryptpMeter);
			                    var instaCustName = responseFromApi.data.lastStageData.customerName;
			                    var displayOnCard = instaCustName;
			                    var encryptCustName = encryptlocal(displayOnCard, pkd);
			                    setCookie("displayOnCard", encryptCustName);
			                    $(".climit").text(
			                        "Rs. " +
			                        addCommaInAmount(responseFromApi.data.lastStageData.cardLimit)
			                    );

			                    $(".amountpay_RU").html(
			                        "<p><strong>Rs. " +
			                        responseFromApi.data.lastStageData.cardFeeAmount +
			                        '<a><i class="icon-noun_Info" onclick="amtpaytooltip();"></i></a></strong><i>Amount to be paid</i></p>'
			                    );
			                    $("html, body").animate(
			                        {
			                            scrollTop: 0,
			                        },
			                        200
			                    );
			                    $("body").removeAttr("style");
			                } else if (responseFromApi.data.nextStage == "CMND") {
			                    $(".page9").show();
			                    $(".payment_text p").html(
			                        "You have successfully made a payment of <b>Rs. " +
			                        responseFromApi.data.lastStageData.cardFeeAmount +
			                        "</b> towards your joining fee of EMI Network Card."
			                    );
			                    $(".trackerMain").hide();
			                    $(".trackerETB").show();
			                    journeyContinueCreateCookie(responseFromApi);

			                    var cardNumber = responseFromApi.data.lastStageData.cardNumber;

			                    var encryptccno = encryptlocal(cardNumber, pkd);
			                    setCookie("iecn", encryptccno);

			                    mandatePodUrl = responseFromApi.data.currentStageData.mandatePodUrl;
			                    var paymentTxnReferenceNumber =
			                        responseFromApi.data.lastStageData.paymentRefrenceNumber;
			                    $(".txnrefno").text(paymentTxnReferenceNumber);
			                    instaCustName = responseFromApi.data.lastStageData.customerName;
			                    var displayOnCard = instaCustName;
			                    var encryptCustName = encryptlocal(displayOnCard, pkd);
			                    setCookie("displayOnCard", encryptCustName);
			                    $("html, body").animate(
			                        {
			                            scrollTop: 0,
			                        },
			                        200
			                    );
			                    $("body").removeAttr("style");
			                } else if (responseFromApi.data.nextStage == "CPLT") {
			                    $(".page10").show();
			                    $(".onlyVcEtb").hide();
			                    setCookie("VC", "vc");

			                    var cardNumber = responseFromApi.data.lastStageData.cardNumber;
			                    cardNumber = cardNumber.replace(/.(?=.{4})/g, "X");
			                    $(".cardContant").find("strong").text(cardNumber);
			                    $(".numberside").text(cardNumber);
			                    var encryptccno = encryptlocal(cardNumber, pkd);
			                    setCookie("iecn", encryptccno);

			                    var qrcheck;
			                    var utmnewCookie = GetCookie("utm_new_cookie");
			                    if (utmnewCookie != null && utmnewCookie != undefined) {
			                        utmnewCookie = JSON.parse(utmnewCookie);
			                        var qrCampaign = utmnewCookie["utm_campaign"];
			                        console.log("utm campaign value : " + qrCampaign);
			                        qrcheck = instaLinkUtmMapping(qrCampaign);
			                        if (qrcheck) {
			                            $(".Exclusive_Offers_slider").html(exclisve);
			                        }
			                    }
			                    $(".validfrom").text(validFrom);
			                    $(".validtill").text(validTill);
			                    $(".username").text(responseFromApi.data.lastStageData.customerName);
			                    $(".availLoanLmt").text("N/A");
			                    $(".totLoanLmt").text(
			                        "Rs. " +
			                        addCommaInAmount(responseFromApi.data.lastStageData.cardLimit)
			                    );

			                    var transactionDetail = {};
			                    transactionDetail.cardLimit =
			                        responseFromApi.data.lastStageData.cardLimit;
			                    transactionDetail.firstTransactionLimit =
			                        responseFromApi.data.lastStageData.firstTransactionLimit;
			                    var enctxn = encryptlocal(JSON.stringify(transactionDetail), pkd);
			                    setCookie("enctxn", enctxn);

			                    var displayOnCard = responseFromApi.data.lastStageData.customerName;
			                    var encryptCustName = encryptlocal(displayOnCard, pkd);
			                    setCookie("displayOnCard", encryptCustName);

			                    var mandRefno = responseFromApi.data.lastStageData.mandateRegNo;
			                    $(".MandRefno").text(mandRefno);
			                    var encryptmandRefno = encryptlocal(mandRefno, pkd);
			                    setCookie("mRefn", encryptmandRefno);
			                    $(".MandDate").text(mandate);

			                    var MandTxnRefNo =
			                        responseFromApi.data.lastStageData.paymentTxnReferenceNumber;
			                    $(".MandTxnRefNo").text(MandTxnRefNo);
			                    var encryptMandTxnRefNo = encryptlocal(MandTxnRefNo, pkd);
			                    setCookie("mTxn", encryptMandTxnRefNo);
			                    $(".Exclusive_Offers_slide").slick("refresh");
			                    $("body").removeAttr("style");
			                } else if (responseFromApi.data.nextStage == "APLF") {
			                    var currentStageData = responseFromApi.data.currentStageData;
			                    var offerDetails = JSON.parse(currentStageData);
			                    var cardLimit = offerDetails.cardLimit;
			                    var cardFees = offerDetails.cardFees;
			                    var customerName = offerDetails.customerName;
			                    Custdob = offerDetails.dob;

			                    var docollectflag = offerDetails.documentCollectionFlag;
			                    setCookie("dcflag", docollectflag);

			                    if (
			                        (cardLimit != null || cardLimit != "null") &&
			                        (cardFees != null || cardFees != "null") &&
			                        (customerName != null || customerName != "null") &&
			                        (Custdob != null || Custdob != "null")
			                    ) {
			                        $(".page5").show();
			                        $(".buttonETB .show6_ETB").removeClass("clicked");
			                        $(".trackerMain").hide();
			                        $(".buttonMain").hide();
			                        $(".trackerETB").show();
			                        $(".buttonETB").show();
			                        $(".addonprice").text("Rs. " + addCommaInAmount(cardLimit));
			                        $(".validfrom").text(validFrom);
			                        $(".validtill").text(validTill);
			                        $(".username").text(customerName);
			                        var displayOnCard = customerName;
			                        var encryptCustName = encryptlocal(displayOnCard, pkd);
			                        setCookie("displayOnCard", encryptCustName);
			                        $("html, body").animate(
			                            {
			                                scrollTop: 0,
			                            },
			                            200
			                        );
			                        $("body").removeAttr("style");
			                    } else {
			                        $(".page17").show();
			                        $(".oh_errorPage")
			                            .find("p")
			                            .text("An unexpected error occurred. Try again after some time.");
			                    }
			                } else if (responseFromApi.data.nextStage == "CCP") {
			                    $(".page17").show();
			                    $(".oh_errorPage")
			                        .find("p")
			                        .text("An unexpected error occurred. Try again after some time.");
			                } else {
			                    $(".page17").show();
			                    $(".oh_errorPage")
			                        .find("p")
			                        .text("An unexpected error occurred. Try again after some time.");
			                }
			            } else {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("An unexpected error occurred. Try again after some time.");
			            }

			            referID = "Retry-" + responseFromApi.data.nextStage + "-" + retryScenario;
			            WCMLeadCaptureClick(responseFromApi, url, referID);
			        } else if (responseFromApi.data.status == "F") {
			            if (message == "2023") {
			                $(".page16").show();
			                $(".buttonPart_2 .downloadcta").show().text("DOWNLOAD APP");
			                $(".buttonPart_2 .downloadcta").attr(
			                    "onclick",
			                    "window.open('" +
			                    appDownloadCTA("https://bfl.onelink.me/857331112/SAM") +
			                    "','_blank');"
			                );
			                $(".emandate_sorry")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".emandate_sorry")
			                    .find("p")
			                    .text("Unfortunately, we don't have an offer for you right now.");
			                /*if (responseFromApi.data.customerType == "ETB") {
			                          $(".emandate_sorry").find("h2").text("Thank you for showing interest in the EMI Network Card");
			                          $(".emandate_sorry").find("p").text("Unfortunately, we don't have an offer for you right now.");                                        
			                          $(".iemi_img").hide();
			                          $(".cross_sell_img").show();			                 
			                        }*/

			                cust_type = responseFromApi.data.customerType;
			                var pageURL = $(location).attr("href");
			                var customer_city = getCookie("tvc_user_city");
			                var utmArray = fetchUtmNewCookie();
			                console.log(utmArray);

			                //var deskImg = ["/sites/bajaj/Insta_Pod_2/images/Group_57173Wallet-2023.svg", "/sites/bajaj/Insta_Pod_2/images/No_Offer_Diwali(2023)festMobilebanner_52023-Appdownload.svg", "/sites/bajaj/Insta_Pod_2/images/NoOffer_Diwali_(2023)festMobilebanner_3CIBIL.svg", "/sites/bajaj/Insta_Pod_2/images/Super_Card_Banner_281x127px_.jpg"];
			                var deskImg = [
			                    "/sites/bajaj/Insta_Pod_2/images/winter_10.png",
			                    "/sites/bajaj/Insta_Pod_2/images/winter_11.png",
			                    "/sites/bajaj/Insta_Pod_2/images/winter_12.png",
			                    "/sites/bajaj/Insta_Pod_2/images/winter_13.png",
			                ];

			                //var mobImg = ["/sites/bajaj/Insta_Pod_2/images/Group_57173Wallet-2023.svg", "/sites/bajaj/Insta_Pod_2/images/No_Offer_Diwali(2023)festMobilebanner_52023-Appdownload.svg", "/sites/bajaj/Insta_Pod_2/images/NoOffer_Diwali_(2023)festMobilebanner_3CIBIL.svg", "/sites/bajaj/Insta_Pod_2/images/SuperCard_Banner_244x92px.jpg"];
			                var mobImg = [
			                    "/sites/bajaj/Insta_Pod_2/images/winter_10.png",
			                    "/sites/bajaj/Insta_Pod_2/images/winter_11.png",
			                    "/sites/bajaj/Insta_Pod_2/images/winter_12.png",
			                    "/sites/bajaj/Insta_Pod_2/images/winter_13.png",
			                ];

			                //var cardLinks = ["https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare&product_code=WCE2&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGNORET&utm_content=N1&utm_term=N2","https://bfl.onelink.me/857331112/SAM?utm_source=" + utmArray[2] + "&utm_medium=" + utmArray[1] + "&utm_campaign=" + utmArray[0], "https://www.bajajfinserv.in/check-free-cibil-score?utm_source=" + utmArray[2] + "&utm_medium=" + utmArray[1] + "&utm_campaign=" + utmArray[0], "https://www.bajajfinserv.in/apply-for-credit-card-online?utm_source=" + utmArray[2] + "&utm_medium=" + utmArray[1] + "&utm_medium=" + utmArray[0]];
			                //var cardLinks = ["https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=" + utmArray[2] + "&utm_medium=" + utmArray[1] + "&utm_campaign=" + utmArray[0] + "&utm_content=N1&utm_term=N2", "https://www.bajajfinserv.in/check-free-cibil-score?utm_source=" + utmArray[2] + "&utm_medium=" + utmArray[1] + "&utm_campaign=" + utmArray[0], "https://www.bajajfinserv.in/apply-for-credit-card-online?utm_source=" + utmArray[2] + "&utm_medium=" + utmArray[1] + "&utm_medium=" + utmArray[0]];
			                var cardLinks = [
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare&product_code=WCE2&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGNORET&utm_content=N1&utm_term=N2",
			                    "https://bfin.in/HWE?%20%20%20utm_source=WEB&utm_medium=SMS&utm_campaign=NOOFFERHWE",
			                    "https://www.bajajfinserv.in/check-free-cibil-score?utm_source=" +
			                    utmArray[2] +
			                    "&utm_medium=" +
			                    utmArray[1] +
			                    "&utm_campaign=" +
			                    utmArray[0],
			                    "https://bfl.onelink.me/857331112/SAM",
			                ];

			                var datalayercall = [
			                    "errorPageBannerDataLayerCall('WalletCare','" +
			                    cust_type +
			                    "','https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGMANRET&utm_content=M1&utm_term=M2','" +
			                    pageURL +
			                    "','" +
			                    customer_city +
			                    "','" +
			                    message +
			                    "');",
			                    "errorPageBannerDataLayerCall('CIBILScore','" +
			                    cust_type +
			                    "','https://www.bajajfinserv.in/check-free-cibil-score?utm_source=website&utm_medium=iemic&utm_campaign=lg','" +
			                    pageURL +
			                    "','" +
			                    customer_city +
			                    "','" +
			                    message +
			                    "');",
			                    "errorPageBannerDataLayerCall('CreditCard','" +
			                    cust_type +
			                    "','https://www.bajajfinserv.in/apply-for-credit-card-online?utm_source=E2EInterested&utm_medium=ICross_sell&utm_medium=bfl','" +
			                    pageURL +
			                    "','" +
			                    customer_city +
			                    "','" +
			                    message +
			                    "');",
			                ];

			                var captureInterest = [
			                    "crossSellLeadCaptureClick();",
			                    "crossSellLeadCaptureClick();",
			                    "crossSellLeadCaptureClick();",
			                ];

			                var carBlock = "";

			                var currentStageData = responseFromApi.data.currentStageData;

			                var offers = JSON.parse(currentStageData);
			                if (offers != null && offers != "null") {
			                    if (offers.hasOwnProperty("offerData")) {
			                        var offerDetails = offers.offerData;
			                        //general card

			                        /*  carBlock = '<div class="Exclusive_Offers_padd WalletCare"><div class="Exclusive_Offers_inner_1"><a onclick="' + captureInterest[0] + '" href="' + cardLinks[0] + '" class="fordesktop" target="_blank"><img src="' + deskImg[0] + '" alt="" onclick="' + datalayercall[0] + '" loading="lazy"> </a><a onclick="' + captureInterest[0] + '" href="' + cardLinks[0] + '" class="formobile" target="_blank"><img src="' + mobImg[0] + '" alt="" onclick="' + datalayercall[0] + '" loading="lazy"> </a></div></div>';
			                                     $(".displayViaLoop").append(carBlock);
			            
			                                     carBlock = '<div class="Exclusive_Offers_padd CIBILScore"><div class="Exclusive_Offers_inner_1"><a onclick="' + captureInterest[1] + '" href="' + cardLinks[1] + '" class="fordesktop" target="_blank"><img src="' + deskImg[1] + '" alt="" onclick="' + datalayercall[1] + '" loading="lazy"> </a><a onclick="' + captureInterest[1] + '" href="' + cardLinks[1] + '" class="formobile" target="_blank"><img src="' + mobImg[1] + '" alt="" onclick="' + datalayercall[1] + '" loading="lazy"> </a></div></div>';
			                                     $(".displayViaLoop").append(carBlock); */
			                        carBlock =
			                            '<div class="Exclusive_Offers_padd WalletCare"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                            captureInterest[0] +
			                            '" href="' +
			                            cardLinks[0] +
			                            '" class="fordesktop" target="_blank"><img src="' +
			                            deskImg[0] +
			                            '" alt="" onclick="' +
			                            datalayercall[0] +
			                            '" loading="lazy"> </a><a onclick="' +
			                            captureInterest[0] +
			                            '" href="' +
			                            cardLinks[0] +
			                            '" class="formobile" target="_blank"><img src="' +
			                            mobImg[0] +
			                            '" alt="" onclick="' +
			                            datalayercall[0] +
			                            '" loading="lazy"> </a></div></div>';
			                        $(".displayViaLoop").append(carBlock);

			                        carBlock =
			                            '<div class="Exclusive_Offers_padd noofferdiwali"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                            captureInterest[1] +
			                            '" href="' +
			                            cardLinks[1] +
			                            '" class="fordesktop" target="_blank"><img src="' +
			                            deskImg[1] +
			                            '" alt="" onclick="' +
			                            datalayercall[1] +
			                            '" loading="lazy"> </a><a onclick="' +
			                            captureInterest[1] +
			                            '" href="' +
			                            cardLinks[1] +
			                            '" class="formobile" target="_blank"><img src="' +
			                            mobImg[1] +
			                            '" alt="" onclick="' +
			                            datalayercall[1] +
			                            '" loading="lazy"> </a></div></div>';
			                        $(".displayViaLoop").append(carBlock);

			                        carBlock =
			                            '<div class="Exclusive_Offers_padd CIBILScore"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                            captureInterest[2] +
			                            '" href="' +
			                            cardLinks[2] +
			                            '" class="fordesktop" target="_blank"><img src="' +
			                            deskImg[2] +
			                            '" alt="" onclick="' +
			                            datalayercall[2] +
			                            '" loading="lazy"> </a><a onclick="' +
			                            captureInterest[2] +
			                            '" href="' +
			                            cardLinks[2] +
			                            '" class="formobile" target="_blank"><img src="' +
			                            mobImg[2] +
			                            '" alt="" onclick="' +
			                            datalayercall[2] +
			                            '" loading="lazy"> </a></div></div>';
			                        $(".displayViaLoop").append(carBlock);

			                        $(".Exclusive_Offers_slide_3").slick("refresh");

			                        for (var i = 0; i < offerDetails.length; i++) {
			                            var obj = offerDetails[i];

			                            if (obj.hasOwnProperty("icorsOfferType")) {
			                                if (obj.icorsOfferType == "credit_card") {
			                                    carBlock =
			                                        '<div class="Exclusive_Offers_padd CreditCard"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                                        captureInterest[2] +
			                                        '" href="' +
			                                        cardLinks[2] +
			                                        '" class="fordesktop" target="_blank"><img src="' +
			                                        deskImg[2] +
			                                        '" alt="" onclick="' +
			                                        datalayercall[2] +
			                                        '" loading="lazy"> </a><a onclick="' +
			                                        captureInterest[2] +
			                                        '" href="' +
			                                        cardLinks[2] +
			                                        '" class="formobile" target="_blank"><img src="' +
			                                        mobImg[2] +
			                                        '" alt="" onclick="' +
			                                        datalayercall[2] +
			                                        '" loading="lazy"> </a></div></div>';

			                                    $(".displayViaLoop").append(carBlock);
			                                    $(".Exclusive_Offers_slide_3").slick("refresh");
			                                }
			                            }
			                        }
			                    } else {
			                        /* carBlock = '<div class="Exclusive_Offers_padd WalletCare"><div class="Exclusive_Offers_inner_1"><a onclick="' + captureInterest[0] + '" href="' + cardLinks[0] + '" class="fordesktop" target="_blank"><img src="' + deskImg[0] + '" alt="" onclick="' + datalayercall[0] + '" loading="lazy"> </a><a onclick="' + captureInterest[0] + '" href="' + cardLinks[0] + '" class="formobile" target="_blank"><img src="' + mobImg[0] + '" alt="" onclick="' + datalayercall[0] + '" loading="lazy"> </a></div></div>';
			                                    $(".displayViaLoop").append(carBlock);
			            
			                                    carBlock = '<div class="Exclusive_Offers_padd CIBILScore"><div class="Exclusive_Offers_inner_1"><a onclick="' + captureInterest[0] + '" href="' + cardLinks[1] + '" class="fordesktop" target="_blank"><img src="' + deskImg[1] + '" alt="" onclick="' + datalayercall[1] + '" loading="lazy"> </a><a onclick="' + captureInterest[1] + '" href="' + cardLinks[1] + '" class="formobile" target="_blank"><img src="' + mobImg[1] + '" alt="" onclick="' + datalayercall[1] + '" loading="lazy"> </a></div></div>';
			                                    $(".displayViaLoop").append(carBlock); */
			                        carBlock =
			                            '<div class="Exclusive_Offers_padd WalletCare"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                            captureInterest[0] +
			                            '" href="' +
			                            cardLinks[0] +
			                            '" class="fordesktop" target="_blank"><img src="' +
			                            deskImg[0] +
			                            '" alt="" onclick="' +
			                            datalayercall[0] +
			                            '" loading="lazy"> </a><a onclick="' +
			                            captureInterest[0] +
			                            '" href="' +
			                            cardLinks[0] +
			                            '" class="formobile" target="_blank"><img src="' +
			                            mobImg[0] +
			                            '" alt="" onclick="' +
			                            datalayercall[0] +
			                            '" loading="lazy"> </a></div></div>';
			                        $(".displayViaLoop").append(carBlock);

			                        carBlock =
			                            '<div class="Exclusive_Offers_padd noofferdiwali"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                            captureInterest[1] +
			                            '" href="' +
			                            cardLinks[1] +
			                            '" class="fordesktop" target="_blank"><img src="' +
			                            deskImg[1] +
			                            '" alt="" onclick="' +
			                            datalayercall[1] +
			                            '" loading="lazy"> </a><a onclick="' +
			                            captureInterest[1] +
			                            '" href="' +
			                            cardLinks[1] +
			                            '" class="formobile" target="_blank"><img src="' +
			                            mobImg[1] +
			                            '" alt="" onclick="' +
			                            datalayercall[1] +
			                            '" loading="lazy"> </a></div></div>';
			                        $(".displayViaLoop").append(carBlock);

			                        carBlock =
			                            '<div class="Exclusive_Offers_padd CIBILScore"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                            captureInterest[2] +
			                            '" href="' +
			                            cardLinks[2] +
			                            '" class="fordesktop" target="_blank"><img src="' +
			                            deskImg[2] +
			                            '" alt="" onclick="' +
			                            datalayercall[2] +
			                            '" loading="lazy"> </a><a onclick="' +
			                            captureInterest[2] +
			                            '" href="' +
			                            cardLinks[2] +
			                            '" class="formobile" target="_blank"><img src="' +
			                            mobImg[2] +
			                            '" alt="" onclick="' +
			                            datalayercall[2] +
			                            '" loading="lazy"> </a></div></div>';
			                        $(".displayViaLoop").append(carBlock);
			                        $(".Exclusive_Offers_slide_3").slick("refresh");
			                    }
			                }
			            } else if (
			                message == "1919" &&
			                responseFromApi.data.customerType == "ETB"
			            ) {
			                $(".page22").show();
			                
			                //For Banner
		                     
			                $(".page22 .bannerUrlOneNine").attr(
				                    "href",
				                    appDownloadCTA("https://bfl.onelink.me/857331112/SAM2")
				                );
			                
				            // For CTA
			                $(".buttonPart_1 .downloadcta ").attr(
				                    "onclick",
				                    "window.open('" +
				                    appDownloadCTA("https://bfl.onelink.me/857331112/SAM2") +
				                    "','_blank');"
				                );
			                
			                $(".wlcmSlider").slick("refresh");
			            } else if (
			                message == "1920" &&
			                responseFromApi.data.customerType == "ETB"
			            ) {
			                cust_type = responseFromApi.data.customerType;
			                var currentstage = responseFromApi.data.currentStageData;
			                console.log("current stage :" + currentstage);
			                var flag = JSON.parse(currentstage);
			                var getDocFlag = flag.documentCollectionFlag;
			                console.log("getdocflag :" + getDocFlag);
			                var qrcheck;
			                var utmnewCookie = GetCookie("utm_new_cookie");
			                if (utmnewCookie != null && utmnewCookie != undefined) {
			                    utmnewCookie = JSON.parse(utmnewCookie);
			                    var qrCampaign = utmnewCookie["utm_campaign"];
			                    console.log("utm campaign value : " + qrCampaign);
			                    qrcheck = instaLinkUtmMapping(qrCampaign);
			                }
			                if (qrcheck) {
			                    $(".page16").show();
			                    $(".emandate_sorry").find("h2").text("Welcome back");
			                    $(".emandate_sorry")
			                        .find("p")
			                        .html(
			                            "You already have an EMI Card. Start shopping at your nearest store by clicking on 'Store Locator' for your favorite products and pay in easy EMIs."
			                        );
			                    $(".page16 .fixedtoMob1 .Exclusive_Offers").hide();
			                    $(".buttonPart_2 .storelocinsta").show();
			                } else {
			                    if (getDocFlag == "N") {
			                        $(".page16").show();
			                        $(".emandate_sorry").find("h2").text("Welcome back");
			                        $(".emandate_sorry")
			                            .find("p")
			                            .html(
			                                "You already have an EMI Network Card. Start shopping online for your favourite products and pay in easy EMIs."
			                            );
			                        $(".page16 .fixedtoMob1 .Exclusive_Offers").hide();
			                        $(".etb_carded").show();
			                        $(".shopOnSlider").slick("refresh");
			                        $(".buttonPart_2").hide();
			                    } else if (getDocFlag == "Y") {
			                        creditCardETBActive(flag);
			                    }
			                }   
			            } else if (message == "1096") {
			                $(".page16").show();
			                $(".emandate_sorry").find("h2").text("Welcome back");
			                $(".emandate_sorry")
			                    .find("p")
			                    .text(
			                        "You already have an EMI Network Card. Start shopping online for your favourite products and pay in easy EMIs."
			                    );
			                $(".page16 .fixedtoMob1 .Exclusive_Offers").hide();
			                $(".etb_carded").show();
			                $(".shopOnSlider").slick("refresh");
			            } else if (
			                message == "1005" ||
			                message == "1006" ||
			                message == "1004" ||
			                message == "1010" ||
			                message == "1012" ||
			                message == "1016" ||
			                message == "1018" ||
			                message == "1049" ||
			                message == "1080" ||
			                message == "1091" ||
			                message == "2001" ||
			                message == "2006" ||
			                message == "2009" ||
			                message == "2065"
			            ) {
			                $(".page17").show();
			                apiErrorHandlings(message, url, null);
			            } else if (message == "2002") {
			                apiErrorHandlings(message, url, null);
			            } else if (message == "1051" || message == "1099") {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing your interest in the Insta EMI Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("You're currently not eligible for this offer.");
			                $(".oh_errorPage > a").hide();
			            } else if (message == "1056" || message == "1058" || message == "1039") {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text(
			                        "We are unable to process your application at the moment. To shop on easy EMIs, visit our partner store near you."
			                    );
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Exclusive offer for you. Buy Wallet Care and secure your debit/credit cards with coverage up to Rs. 2 lacs. Also get an annual Zee5 subscription for free."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("AVAIL OFFER");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGPRL&utm_content=PR1&utm_term=PR2"
			                );
			            } else if (
			                message == "1032" ||
			                message == "1035" ||
			                message == "1040" ||
			                message == "1041" ||
			                message == "1042" ||
			                message == "2052"
			            ) {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, your KYC details couldn't be verified. You could, however, proceed with your KYC submission at our nearest partner store. Download App and explore other financial services on the go."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("DOWNLOAD APP");
			                //$(".oh_errorPage .otheroptioncta").attr("href", "https://bfl.onelink.me/857331112/qa4");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    appDownloadCTA("https://bfl.onelink.me/857331112/qa4")
			                );
			            } else if (message == "1090") {
			                $(".page13").show();
			                $(".paymentFailed")
			                    .find("strong")
			                    .text("Rs. " + responseFromApi.data.lastStageData.cardFeeAmount);
			                $(".orderid").text("ORDER ID " + responseFromApi.data.podRequestId);
			                podRequestId = responseFromApi.data.podRequestId;
			                var encryptpodReqID = encryptlocal(podRequestId, pkd);
			                setCookie("pRI", encryptpodReqID);
			                var newAddressUpdate =
			                    responseFromApi.data.lastStageData.newAddressToBeUpdated;
			                if (newAddressUpdate == undefined || newAddressUpdate == null) {
			                    newAddressUpdate = "false";
			                } else {
			                    newAddressUpdate = newAddressUpdate;
			                }
			                setCookie("nAtbUp", newAddressUpdate);
			                $(".faileddate").text(mandate);
			                var paytxnno = responseFromApi.data.lastStageData.paymentRefrenceNumber;
			                if (paytxnno == "null" || paytxnno == null || paytxnno == undefined) {
			                    $(".txnno").text("N/A");
			                } else {
			                    $(".txnno").text(paytxnno);
			                }
			                var transactionDetail = {};
			                transactionDetail.cardLimit =
			                    responseFromApi.data.lastStageData.cardLimit;
			                transactionDetail.cardFeeAmount =
			                    responseFromApi.data.lastStageData.cardFeeAmount;
			                transactionDetail.firstTransactionLimit =
			                    responseFromApi.data.lastStageData.firstTransactionLimit;
			                var enctxn = encryptlocal(JSON.stringify(transactionDetail), pkd);
			                setCookie("enctxn", enctxn);
			                var displayOnCard = responseFromApi.data.lastStageData.customerName;
			                var encryptCustName = encryptlocal(displayOnCard, pkd);
			                setCookie("displayOnCard", encryptCustName);
			                paymentGatewayURL =
			                    responseFromApi.data.currentStageData.paymentGatewayURL;
			                paymentGatewayParameters =
			                    responseFromApi.data.currentStageData.paymentGatewayParameters;
			                payparameter = paymentGatewayParameters;
			                var fields = payparameter.split("=");
			                payparameter = fields[1];
			                var pURL = paymentGatewayURL;
			                var encryptpURL = encryptlocal(pURL, pkd);
			                setCookie("pU", encryptpURL);
			                var pMeter = payparameter;
			                var encryptpMeter = encryptlocal(pMeter, pkd);
			                setCookie("pM", encryptpMeter);
			                $("html, body").animate(
			                    {
			                        scrollTop: 0,
			                    },
			                    200
			                );
			                $("body").removeAttr("style");
			            }
			            // BRE error codes OTPV
			            else if (
			                message == "115" ||
			                message == "402" ||
			                message == "403" ||
			                message == "404" ||
			                message == "405" ||
			                message == "406" ||
			                message == "501" ||
			                message == "502" ||
			                message == "503" ||
			                message == "001" ||
			                message == "002" ||
			                message == "003" ||
			                message == "004" ||
			                message == "005" ||
			                message == "306"
			            ) {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text(
			                        "We are unable to process your application at the moment. To shop on easy EMIs, visit our partner store near you."
			                    );
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Exclusive offer for you. Buy Wallet Care and secure your debit/credit cards with coverage up to Rs. 2 lakh. Also, get an annual Zee5 subscription for free."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("AVAIL OFFER");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGPRL&utm_content=PR1&utm_term=PR2"
			                );
			            } else if (
			                message == "203" ||
			                message == "300" ||
			                message == "301" ||
			                message == "302" ||
			                message == "303" ||
			                message == "304" ||
			                message == "305" ||
			                message == "307" ||
			                message == "308" ||
			                message == "309" ||
			                message == "310" ||
			                message == "311" ||
			                message == "312" ||
			                message == "313" ||
			                message == "314" ||
			                message == "315" ||
			                message == "316" ||
			                message == "317" ||
			                message == "318" ||
			                message == "105" ||
			                message == "401" ||
			                message == "504"
			            ) {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text(
			                        "We are unable to process your application at the moment. To shop on easy EMIs, visit our partner store near you."
			                    );
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Exclusive offer for you. Buy Wallet Care and secure your debit/credit cards with coverage up to Rs. 2 lakh. Also, get an annual Zee5 subscription for free."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("AVAIL OFFER");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGUWRET&utm_content=U1&utm_term=U2"
			                );
			            } else if (message == "204" || message == "504") {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text(
			                        "Thank you for showing your interest in the EMI Network Card. Unfortunately, we do not have an offer for you right now."
			                    );
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "You can also secure your wallet along with an online fraud cover of up to 2 lakhs in just 3 clicks."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("GET IT NOW");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGUWRET&utm_content=U1&utm_term=U2"
			                );
			            } else if (message == "116" || message == "117") {
			                $(".page16").show();
			                $(".emandate_sorry")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".emandate_sorry")
			                    .find("p")
			                    .text("Unfortunately, we don't have an offer for you right now.");
			                $(".buttonPart_2").hide();

			                cust_type = responseFromApi.data.customerType;
			                var pageURL = $(location).attr("href");
			                var customer_city = getCookie("tvc_user_city");
			                var utmArray = fetchUtmNewCookie();
			                //console.log(utmArray);

			                var deskImg = [
			                    "/sites/bajaj/Insta_Pod_2/images/WALLET-CARE-ADAPT-DEKSTOP-281x127.jpg",
			                    "/sites/bajaj/Insta_Pod_2/images/CHR-Thank-you-Banner_281x127.jpg",
			                    "/sites/bajaj/Insta_Pod_2/images/Super_Card_Banner_281x127px_.jpg",
			                ];

			                var mobImg = [
			                    "/sites/bajaj/Insta_Pod_2/images/WALLET-CARE-ADAPT-MOBILE-244x92.jpg",
			                    "/sites/bajaj/Insta_Pod_2/images/CHR-Thank-you-Banner_244x92.jpg",
			                    "/sites/bajaj/Insta_Pod_2/images/SuperCard_Banner_244x92px.jpg",
			                ];

			                var cardLinks = [
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=" +
			                    utmArray[2] +
			                    "&utm_medium=" +
			                    utmArray[1] +
			                    "&utm_campaign=" +
			                    utmArray[0] +
			                    "&utm_content=N1&utm_term=N2",
			                    "https://www.bajajfinserv.in/check-free-cibil-score?utm_source=" +
			                    utmArray[2] +
			                    "&utm_medium=" +
			                    utmArray[1] +
			                    "&utm_campaign=" +
			                    utmArray[0],
			                    "https://www.bajajfinserv.in/apply-for-credit-card-online?utm_source=" +
			                    utmArray[2] +
			                    "&utm_medium=" +
			                    utmArray[1] +
			                    "&utm_medium=" +
			                    utmArray[0],
			                ];

			                var datalayercall = [
			                    "errorPageBannerDataLayerCall('WalletCare','" +
			                    cust_type +
			                    "','https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGUWRET&utm_content=U1&utm_term=U2','" +
			                    pageURL +
			                    "','" +
			                    customer_city +
			                    "','" +
			                    message +
			                    "');",
			                    "errorPageBannerDataLayerCall('CIBILScore','" +
			                    cust_type +
			                    "','https://www.bajajfinserv.in/check-free-cibil-score?utm_source=website&utm_medium=iemic&utm_campaign=lg','" +
			                    pageURL +
			                    "','" +
			                    customer_city +
			                    "','" +
			                    message +
			                    "');",
			                    "errorPageBannerDataLayerCall('CreditCard','" +
			                    cust_type +
			                    "','https://www.bajajfinserv.in/apply-for-credit-card-online?utm_source=E2EInterested&utm_medium=ICross_sell&utm_medium=bfl','" +
			                    pageURL +
			                    "','" +
			                    customer_city +
			                    "','" +
			                    message +
			                    "');",
			                ];

			                var captureInterest = [
			                    "crossSellLeadCaptureClick();",
			                    "crossSellLeadCaptureClick();",
			                    "crossSellLeadCaptureClick();",
			                ];

			                var carBlock = "";

			                var currentStageData = responseFromApi.data.currentStageData;

			                var offers = JSON.parse(currentStageData);
			                if (offers != null && offers != "null") {
			                    if (offers.hasOwnProperty("offerData")) {
			                        var offerDetails = offers.offerData;
			                        //general card

			                        carBlock =
			                            '<div class="Exclusive_Offers_padd WalletCare"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                            captureInterest[0] +
			                            '" href="' +
			                            cardLinks[0] +
			                            '" class="fordesktop" target="_blank"><img src="' +
			                            deskImg[0] +
			                            '" alt="" onclick="' +
			                            datalayercall[0] +
			                            '" loading="lazy"> </a><a onclick="' +
			                            captureInterest[0] +
			                            '" href="' +
			                            cardLinks[0] +
			                            '" class="formobile" target="_blank"><img src="' +
			                            mobImg[0] +
			                            '" alt="" onclick="' +
			                            datalayercall[0] +
			                            '" loading="lazy"> </a></div></div>';
			                        $(".displayViaLoop").append(carBlock);

			                        carBlock =
			                            '<div class="Exclusive_Offers_padd CIBILScore"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                            captureInterest[1] +
			                            '" href="' +
			                            cardLinks[1] +
			                            '" class="fordesktop" target="_blank"><img src="' +
			                            deskImg[1] +
			                            '" alt="" onclick="' +
			                            datalayercall[1] +
			                            '" loading="lazy"> </a><a onclick="' +
			                            captureInterest[1] +
			                            '" href="' +
			                            cardLinks[1] +
			                            '" class="formobile" target="_blank"><img src="' +
			                            mobImg[1] +
			                            '" alt="" onclick="' +
			                            datalayercall[1] +
			                            '" loading="lazy"> </a></div></div>';
			                        $(".displayViaLoop").append(carBlock);

			                        $(".Exclusive_Offers_slide_3").slick("refresh");

			                        for (var i = 0; i < offerDetails.length; i++) {
			                            var obj = offerDetails[i];

			                            if (obj.hasOwnProperty("icorsOfferType")) {
			                                if (obj.icorsOfferType == "credit_card") {
			                                    carBlock =
			                                        '<div class="Exclusive_Offers_padd CreditCard"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                                        captureInterest[2] +
			                                        '" href="' +
			                                        cardLinks[2] +
			                                        '" class="fordesktop" target="_blank"><img src="' +
			                                        deskImg[2] +
			                                        '" alt="" onclick="' +
			                                        datalayercall[2] +
			                                        '" loading="lazy"> </a><a onclick="' +
			                                        captureInterest[2] +
			                                        '" href="' +
			                                        cardLinks[2] +
			                                        '" class="formobile" target="_blank"><img src="' +
			                                        mobImg[2] +
			                                        '" alt="" onclick="' +
			                                        datalayercall[2] +
			                                        '" loading="lazy"> </a></div></div>';

			                                    $(".displayViaLoop").append(carBlock);
			                                    $(".Exclusive_Offers_slide_3").slick("refresh");
			                                }
			                            }
			                        }
			                    } else {
			                        carBlock =
			                            '<div class="Exclusive_Offers_padd WalletCare"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                            captureInterest[0] +
			                            '" href="' +
			                            cardLinks[0] +
			                            '" class="fordesktop" target="_blank"><img src="' +
			                            deskImg[0] +
			                            '" alt="" onclick="' +
			                            datalayercall[0] +
			                            '" loading="lazy"> </a><a onclick="' +
			                            captureInterest[0] +
			                            '" href="' +
			                            cardLinks[0] +
			                            '" class="formobile" target="_blank"><img src="' +
			                            mobImg[0] +
			                            '" alt="" onclick="' +
			                            datalayercall[0] +
			                            '" loading="lazy"> </a></div></div>';
			                        $(".displayViaLoop").append(carBlock);

			                        carBlock =
			                            '<div class="Exclusive_Offers_padd CIBILScore"><div class="Exclusive_Offers_inner_1"><a onclick="' +
			                            captureInterest[1] +
			                            '" href="' +
			                            cardLinks[1] +
			                            '" class="fordesktop" target="_blank"><img src="' +
			                            deskImg[1] +
			                            '" alt="" onclick="' +
			                            datalayercall[1] +
			                            '" loading="lazy"> </a><a onclick="' +
			                            captureInterest[1] +
			                            '" href="' +
			                            cardLinks[1] +
			                            '" class="formobile" target="_blank"><img src="' +
			                            mobImg[1] +
			                            '" alt="" onclick="' +
			                            datalayercall[1] +
			                            '" loading="lazy"> </a></div></div>';
			                        $(".displayViaLoop").append(carBlock);

			                        $(".Exclusive_Offers_slide_3").slick("refresh");
			                    }
			                }
			            } else {
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("An unexpected error occurred. Try again after some time.");
			            }
			        }
			    }

			    function messagesplitter(responseFromApi) {
			        var msge = responseFromApi.data.message;
			        var fields = msge.split("|");
			        msge = fields[0];
			        return msge;
			    }

			    /* Checking empty, null or undefined*/
			    function checkEmptyOrNull(data) {
			        if (data != null && data != "null" && data != "" && data != undefined) {
			            return data;
			        }

			        return null;
			    }

			    /* timeloader for page 17_1 */
			    function timeLoader() {
			        var timeleft = 10;
			        var downloadTimer = setInterval(function () {
			            timeleft--;
			            $(".redirectLine p i").text(timeleft);
			            if (timeleft <= 0) {
			                clearInterval(downloadTimer);
			                $(".page17_1").hide();
			                console.log("calling retry process...");
			                apiRequestCreation("RetryProcess");
			            }
			        }, 1000);
			    }

			    /* fetching utm_new_cookie */
			    function fetchUtmNewCookie() {
			        var utmNewCookie = getCookiee("utm_new_cookie");
			        var returnUtm = [];
			        if (utmNewCookie != null) {
			            var parsedUtmNewCookie = JSON.parse(utmNewCookie);
			            returnUtm[0] = parsedUtmNewCookie["utm_campaign"];
			            returnUtm[1] = parsedUtmNewCookie["utm_medium"];
			            returnUtm[2] = parsedUtmNewCookie["utm_source"];
			            return returnUtm;
			        }
			        returnUtm[0] = "website";
			        returnUtm[1] = "bfl";
			        returnUtm[2] = "organic_bfl";

			        return returnUtm;
			    }

			    function appDownloadCTA(oldURL) {
			        const utmSources = [
			            "organic_bfl",
			            "how_can_i_check_my_bajaj_finserv_emi_card_limit_online",
			            "bajajfinserv_eligibility_for_emi_card",
			            "mkt_website",
			            "bajajfinserv_lap_contact_us",
			            "bajajfinserv_pay_online_footer",
			            "bajajfinserv_search_cta",
			            "bajajfinserv-apply-for-credit-card.paperform.co",
			            "bfl_website",
			            "pstp",
			            "TM_organic",
			            "Organic",
			            "website",
			            "Website_Home_Page",
			            "bfl_website",
			            "bfl_website",
			            "bflwebsite",
			            "bing",
			            "duckduckgo",
			            "youtube",
			            "organic_bfl_C",
			            "how_can_i_check_my_bajaj_finserv_emi_card_number",
			            "insights_bajaj_finserv_customer_care",
			            "bajajfinserv_emi_card_contact_us",
			            "lemnisk",
			            "bajajfinserv_loan_account_number",
			            "bajajfinserv_pl_contact_us",
			            "bajajfinserv_unblock_emi_card",
			            "bajajfinservcms.atlassian.net",
			            "WebsiteBusinessLoan",
			            "bfl_website",
			            "bfl_website",
			            "bfl_website",
			            "BOT",
			            "E2E",
			            "E2EInterested",
			            "eml.tr.bajajsolution.in",
			            "Organic_Chatbot",
			            "how_can_i_download_the_bajaj_finserv_digital_emi_card",
			            "insights_bajaj_finserv_customer_care_number",
			            "bajajfinserv_emi_card_limit_increase",
			            "bajajfinserv_pl_loan_statement",
			            "bajajfinserv_unsubscribe_calls",
			            "bajajfinservconsumer.secure.force.com",
			            "mkt_websiteweb",
			            "websitechatbot",
			            "bfl_website",
			            "bfl_website",
			            "bfl_website",
			            "bfl_website",
			            "bfsltrade.bajajfinservsecurities.in",
			            "bpc.bajajfinservsecurities.in",
			            "E2E_INTERESTED",
			            "ECOMMERCE",
			            "how_can_i_get_my_bajaj_finserv_virtual_card_number",
			            "insights_bajaj_finserv_online_payment",
			            "bajajfinserv_emi_card_login",
			            "bajajfinserv_raise_a_request",
			            "bajajfinserv_update_mobile_number",
			            "bajajfinservcreditcard.paperform.co",
			            "twitter",
			            "BFL-SEO-Pages",
			            "BFSLWEBSITE",
			            "CIBIL_PAGE",
			            "ecosia.org",
			            "how_can_i_increase_the_limit_of_my_bajaj_finserv_emi_card",
			            "insights_how_to_unblock_bajaj_finserv_emi_network_card",
			            "bajajfinserv_emi_card_number",
			            "bajajfinserv_reach_us",
			            "bajajfinserv_use_emi_card",
			            "bajajfinservcreditcarddisplay.paperform.co",
			            "bajaj-health-emi-card.paperform.co",
			            "uat-bajajfinance.cs86.force.com",
			            "Website__Cibil",
			            "dispositions.bajajfinservsecurities.in",
			            "ekyc2.bajajfinservsecurities.in",
			            "GMB",
			            "bajajfinance-uat.adobecqms.net",
			            "how_to_get_loan_statement_from_bajaj_finance",
			            "bajajfinserv_check_emi_card_limit",
			            "bajajfinserv_customer_portal",
			            "bajajfinserv_emi_card_payment",
			            "bajajfinserv_emi_network_faqs",
			            "bajajfinserv_get_virtual_card_number",
			            "bajajfinserv_how_can_i_change_pin",
			            "bajajhousingfinance.goldmineltd.com",
			            "MKTG_Reengage_CS",
			            "myaccount.bajajhousingfinance.in",
			            "websitehindi.com",
			            "facebook",
			            "author-bajajfinance-qa.adobecqms.net",
			            "bajaj_finance_blu_on_google_assistant",
			            "BajajFinanceWeb",
			            "how_to_unblock_bajaj_finserv_emi_card",
			            "bajajfinserv_check_emi_card_number",
			            "bajajfinserv_emi_card_pin",
			            "bajajfinserv_health_card_contact_us",
			            "bajajfinserv_increase_emi_card_limit",
			            "bajajhousingfinance.in",
			            "MKTG_REENGAGE_EMAIL",
			            "mysite.bajajfinservlending.in",
			            "qwant.com",
			            "websiteutm_medium=iemic",
			            "google",
			            "author-bajajfinance-stage.adobecqms.net",
			            "bajaj_finserv_wallet_contact_us",
			            "insights",
			            "bajajfinserv_contactus_faq",
			            "bajajfinserv_customer_portal_PAC",
			            "bajajfinserv_emi_card_statement",
			            "bajajfinserv_hl_contact_us",
			            "bajajfinserv_insights",
			            "bfl_dpr",
			            "MKTG_REENGAGE_NOTIFICATION",
			            "n1_bflwebsite_bnot",
			            "RPMGMedia_RCSutm_mediumhttps",
			            "www-bajajfinserv-in.translate.goog",
			            "(direct)",
			            "bajajfinserv_insights",
			            "bfl_dpr",
			            "MKTG_REENGAGE_NOTIFICATION",
			            "n1_bflwebsite_bnot",
			            "RPMGMedia_RCSutm_mediumhttps",
			            "www-bajajfinserv-in.translate.goog",
			            "(direct)",
			            "b2b",
			            "bajajallianzlife.com",
			            "bajajfinserv",
			            "n1_bflwebsite_email",
			            "terms-and-conditions-ganesh-chaturthi.bajajfinservsecurities.in",
			            "yahoo",
			            "<brokercode>_organic",
			            "bagicmail.bajajallianz.com",
			            "bajajauto.com",
			            "bajajfinserv",
			            "bajajfinserv",
			            "bajajfinserv_download_account_statement",
			            "bajajfinserv_emi_contact_us",
			            "bajajfinserv_home_loan_emi_payment",
			            "bajajfinserv_jump_to_quick_pay",
			            "bajaj-finserv-preapproved-loan-for-doctors.paperform.co",
			            "mtf.bajajfinservsecurities.in",
			            "yandex",
			            "ask",
			            "bagicwebmail.bajajallianz.com",
			            "bajajautofinance.com",
			            "how_can_i_use_my_bajaj_finserv_emi_card",
			            "instagram",
			            "bajaj-finserv-credit-card-form.paperform.co",
			            "bajajfinservrblcreditcard.paperform.co",
			            "organic_web",
			            "Organic",
			            "Organic",
			            "author-bajajfinance-dev.adobecqms.net",
			            "bajajfinance.com",
			            "how_do_i_change_bank_account_details_for_payments_to_bajaj_finserv",
			            "bajajfinserv_call_us",
			            "Instagram_story",
			            "bajaj-finserv-emi-reengage.paperform.co",
			            "bajaj-finserv-salpro.paperform.co",
			            "paisawapas",
			            "Organic_markets",
			            "bfl_website",
			            "author-bajajfinance-prod.adobecqms.net",
			            "how_can_i_check_my_bajaj_finserv_emi_card_details",
			            "bajajfinance.secure.force.com",
			            "how_to_change_registered_mobile_number_for_bajaj_finserv_emi_card",
			            "bajajfinserv_change_account_details",
			            "KARRIX",
			            "bajajfinserv_emi_overdue",
			            "bajajfinservgrowth.force.com",
			            "bajajfinservsecurities.in",
			            "partner.bajajfinservsecurities.in",
			            "Organic_markets",
			            "Organic_markets",
			            "bajajfinance.sharepoint.com",
			            "how_to_check_bajaj_finserv_personal_loan_statement",
			            "bajajfinserv_change_mobile_number",
			            "kpoint",
			            "bajajfinserv_fd_contact_us",
			            "bajajfinservgrowth.secure.force.com",
			            "bajajgroup.company",
			            "Partnership",
			            "Organic_Re-engage",
			            "bajajfinance-qa.adobecqms.net",
			            "how_to_download_account_statement_from_bajaj_finserv",
			            "bajajfinserv_check_emi_card_details",
			            "kyc_website",
			            "bajajfinserv_get_loan_statement",
			            "bajaj-finserv-pq.paperform.co",
			            "pn-mobile",
			            "NLPChatbot",
			            "oneweb.bajajhousingfinance.in",
			            "Mktg_media",
			            "Mktg_media2",
			            "Google_Discovery",
			            "RI",
			            "Mktg_media3",
			            "Mktg_media1",
			            "Mktg_media4",
			            "mktg_google",
			            "RM",
			            "Google_Search",
			            "Google_Discovey",
			            "Google_Display",
			            "Google_Perfmax",
			            "Google_Youtube",
			            "Google_Performance",
			            "Mktg_media5",
			            "emi_store",
			            "eStore_Markets",
			            "Organic_markets",
			            "EMI-Store",
			            "eStore_campaign",
			            "Organic_M",
			            "Experia_Outbond",
			            "Experia_Outbound",
			            "Experia_Remarketing",
			            "experia",
			            "experia_bfl",
			            "Experia_web",
			            "Experia_website",
			            "insights_bajaj_experia_customer_portal",
			            "Experia_portal",
			            "Experia Portal",
			            "ExperiaWeb",
			            "experia_bajaj_online_payment",
			            "Experia-Web",
			            "EXP",
			            "bajajfinserv_myaccount_header",
			            "bajajfinserv_myaccount_header_pay_online",
			            "organic_myaccount",
			        ];
			        const utmArray = fetchUtmNewCookie();
			        let utmSource = utmArray[2];
			        const url = "https://bfl.onelink.me/857331112/a5";
			        let match = false;

			        console.log(utmArray);

			        utmSources.forEach((e) => {
			            if (e.localeCompare(utmSource) === 0) match = true;
			        });

			        return match ? url : oldURL;
			    }

			    /* utm carry forward for error 1920 & ETB */
			    function changeCardLinks() {
			        var utmArray = fetchUtmNewCookie();
			        console.log(utmArray);

			        var newCardLinks = [
			            "https://www.bajajfinserv.in/emi-network-health-emi-card-apply-online?utm_source=" +
			            utmArray[2] +
			            "&utm_medium=" +
			            utmArray[1] +
			            "&utm_campaign=" +
			            utmArray[0],
			            "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=" +
			            utmArray[2] +
			            "&utm_medium=" +
			            utmArray[1] +
			            "&utm_campaign=" +
			            utmArray[0] +
			            "&utm_content=E1&utm_term=E2",
			            "https://www.bajajfinserv.in/apply-for-credit-card-online?utm_source=" +
			            utmArray[2] +
			            "&utm_medium=" +
			            utmArray[1] +
			            "&utm_campaign=" +
			            utmArray[0],
			        ];

			        $(
			            'a[href^="https://www.bajajfinserv.in/emi-network-health-emi-card-apply-online?utm_source=EMI_PMG&utm_medium= IPSMS&utm_campaign= PMG_HEMI_ETIV"]'
			        ).attr("href", newCardLinks[0]);
			        $(
			            'a[href^="https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGETAC&utm_content=E1&utm_term=E2"]'
			        ).attr("href", newCardLinks[1]);
			        $(
			            'a[href^="https://www.bajajfinserv.in/apply-for-credit-card-online?utm_source=EMIPMG&utm_medium=IPSMS&utm_campaign=PMG_RBL_ETIV"]'
			        ).attr("href", newCardLinks[2]);
			    }
	            /*credit card etb active journey */
	            function creditCardETBActive(response) {
				  const offerData = response.offerData;
				  let userOfferCount = 0;
				  const offer = { displayName: "default", offerPriority: 0 };
				  
				  if (offerData != null && offerData != "null" && offerData != "" && offerData != undefined){
				
					  // for finding count of offers
					  offerData.forEach((e) => {
					    if (e.poName === "credit_card_oms" && (e.displayName === "RBL" || e.displayName === "DBS")) {
					      if (userOfferCount === 0) {
					        checkOfferPriority(offer, e.displayName, e.displayPriority);
					        userOfferCount++;
					      } else if (e.displayPriority === offer.offerPriority && e.displayName !== offer.displayName) {
					        offer.displayName = "RBL";
					      } else if (e.displayPriority === 1) {
					        checkOfferPriority(offer, e.displayName, e.displayPriority);
					      } else {
					      }
					    }
					  });
				  }
				  
				
				  //for display credit card page
				  if (offer.displayName === "default") {
				    $(".page21").show();
				    $(".buttonPart_1 .shoponlineinsta").show().text("DOWNLOAD YOUR EMI NETWORK CARD");
				    $(".part21 .bannerUrlTwoZero").attr("href", "window.open('https://bfl.onelink.me/857331112/qrh','_blank');");
				
				    $(".buttonPart_1 .shoponlineinsta").attr("onclick", "window.open('" + appDownloadCTA("https://bfl.onelink.me/857331112/qrh") + "','_blank');");
				    $(".wlcmSlider").slick("refresh");
				  } else if (offer.displayName === "RBL") {
				    $(".page21_1").show();
				  } else {
				    $(".page21_2").show();
				  }
				}
				
				function checkOfferPriority(offer, displayName, offerPriority) {
				  if (offerPriority === null || offerPriority === "null" || offerPriority === "" || offerPriority === undefined) {
				    offer.displayName = "default";
				    offer.offerPriority = 0;
				  } else if (offerPriority < offer.offerPriority) {
				    offer.displayName = displayName;
				    offer.offerPriority = offerPriority;
				  } else {
				    offer.displayName = displayName;
				    offer.offerPriority = offerPriority;
				  }
				} 
			    
			    /* checking journey coming from qr */
			    function setChannelID() {
			        console.log("inside setChannelID");
			        if (qrRes != undefined && qrRes != "" && qrRes != null) {
			            return "UQR";
			        }
			        return "IEMIPMG";
			    }

			    /* checking address & relation */
			    function checkAddressAndRelation(responseFromApi) {
			        addressStatus = responseFromApi.data.currentStageData.newAddressToBeUpdated;
			        relationshipStatus =
			            responseFromApi.data.currentStageData.updateRelationshipFlag;

			        console.log("AddressUpdateFlag: " + addressStatus);
			        console.log("RelationshipStatusFlag: " + relationshipStatus);

			        if (
			            (addressStatus != undefined && relationshipStatus != undefined) ||
			            (addressStatus != null && relationshipStatus != null) ||
			            (addressStatus != "null" && relationshipStatus != "null")
			        ) {
			            if (addressStatus == "true" && relationshipStatus == "true") {
			                // todo: if both addressStatus & relationStatus are true both should be populated
			                console.log("both addressStatus & relationStatus are true");
			            } else if (addressStatus == "false" && relationshipStatus == "true") {
			                // todo: if addressStatus false & relationStatus true only relation should be populated
			                console.log("addressStatus false & relationStatus true");
			                $(".bookCon_2").hide();
			                $(".address_status").hide();
			            } else if (addressStatus == "true" && relationshipStatus == "false") {
			                // todo: if addressStatus true & relationStatus false only address should be populated
			                console.log("addressStatus true & relationStatus false");
			                $(".relation_status").hide();
			                $("#mother").prop("checked", false);
			            } /*else if (addressStatus == "false" && relationshipStatus == "false") {
			                  // todo: if addressStatus false & relationStatus are false should redircted to payment summary 
			                  console.log("addressStatus false & relationStatus are false");
			                  $(".page7").hide();
			                  $(".page8").show();
			              } */ else {
			                // todo: other than
			                console.log("other");
			            }
			        } else {
			            console.log("addressStatus or relationshipStatus is null");
			        }
			    }

			    function addCommaInAmount(x) {
			        x = x.toString();
			        var lastThree = x.substring(x.length - 3);
			        var otherNumbers = x.substring(0, x.length - 3);
			        if (otherNumbers != "") lastThree = "," + lastThree;
			        var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
			        return res;
			    }

			    function apiErrorHandlings(errorCode, url, response) {
			        console.log("url in error " + url);

			        trackPageView("ERROR_PAGE_" + errorCode);

			        console.log("response: " + JSON.stringify(response));

			        if (
			            response != null &&
			            response != "null" &&
			            response != "" &&
			            response != undefined
			        ) {
			            if (
			                response.data != null &&
			                response.data != "null" &&
			                response.data != "" &&
			                response.data != undefined
			            ) {
			                var responseData = response.data;
			                console.log("responseData check: " + responseData);

			                if (responseData.hasOwnProperty("message")) {
			                    message = responseData.message;
			                } else {
			                    message = "message key is not present in response";
			                }
			            } else {
			                console.log("response data is null " + responseData);
			                message = "data key is not present in response";
			            }
			        }

			        switch (errorCode) {
			            case 91:
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Too many OTP requests. Try again after 30 minutes");
			                retryScenario = "error 91";
			                $(".oh_errorPage .error_retry").addClass("gotologin");
			                break;
			            case 92:
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Exceeded number of times an otp can be validated");
			                retryScenario = "error 92";
			                $(".oh_errorPage .error_retry").addClass("gotologin");
			                break;
			            case 93:
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Otp is not requested from this site");
			                retryScenario = "error 93";
			                $(".oh_errorPage .error_retry").addClass("gotologin");
			                break;
			            case 94:
			                $(".oh_errorPage").find("p").text("Invalid request id");
			                retryScenario = "error 94";
			                $(".oh_errorPage .error_retry").addClass("gotologin");
			                break;
			            case 99:
			                retryScenario = "Session Timeout";
			                $(".oh_errorPage").find("h2").text("There was an unexpected issue");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Looks like your session timed out. Please try again.");
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "Timeout",
			                });
			                break;
			            case 401:
			                $(".page18").hide();
			                $(".page17").show();
			                retryScenario = "Unauthorized";
			                $(".oh_errorPage").find("h2").text("Timeout");
			                $(".oh_errorPage .error_retry").addClass("gotologin");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Your session has been timed-out. Try again");
			                break;
			            case 403:
			                //$(".page18").hide();
			                //$(".page17").show();
			                retryScenario = "Access Forbidden";
			                $(".oh_errorPage .error_retry").addClass("gotologin");
			                $(".oh_errorPage").find("p").text("Access Forbidden");
			                break;
			            case 404:
			                $(".page18").hide();
			                $(".page17").show();
			                retryScenario = "404 error";
			                $(".oh_errorPage .error_retry").addClass("gotologin");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("We are unable to process your request. Try again later.");
			                break;
			            case 406:
			                $(".page18").hide();
			                $(".page17").show();
			                retryScenario = "Invalid Encryption Request";
			                $(".oh_errorPage").find("p").text("Invalid Encryption Request");
			                break;
			            case 408:
			                $(".page18").hide();
			                $(".page17").show();
			                retryScenario = "Timed-out 408";
			                $(".oh_errorPage .error_retry").addClass("gotologin");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Your session has been timed-out. Try again");
			                break;
			            case 500:
			                $(".page18").hide();
			                $(".page17").show();
			                retryScenario = "error 500";
			                $(".oh_errorPage").find("p").text("500 server error");
			                break;
			            case 502:
			                $(".page18").hide();
			                $(".page17").show();
			                retryScenario = "error 502";
			                $(".oh_errorPage").find("p").text("Bad Gateway error");
			                break;
			            case "CORS error":
			                $(".page18").hide();
			                $(".page17").show();
			                retryScenario = "CORS error";
			                $(".oh_errorPage .error_retry").addClass("gotologin");
			                $(".oh_errorPage").find("p").text("CORS policy error");
			                break;
			            case "1002":
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Unfortunately, there was an unexpected error. Please try again after sometime"
			                    );
			                $(".oh_errorPage > a").hide();
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "Request validation Not Succesful",
			                });
			                break;
			            case "1005":
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Unfortunately, there was an unexpected error. Please try again after sometime"
			                    );
			                $(".oh_errorPage > a").hide();
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "Channel not registered",
			                });
			                break;
			            case "1006":
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Unfortunately, there was an unexpected error. Please try again after sometime"
			                    );
			                $(".oh_errorPage > a").hide();
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "Subscription not registered",
			                });
			                break;
			            case "1007":
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Unfortunately, there was an unexpected error. Please try again after sometime"
			                    );
			                $(".oh_errorPage > a").hide();
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "Channel and subscription both not registered",
			                });
			                break;
			            case "1010":
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Unfortunately, there was an unexpected error. Please try again after sometime"
			                    );
			                $(".oh_errorPage > a").hide();
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "Channel is NOT mapped with the subscription",
			                });
			                break;
			            case "1012":
			                retryScenario =
			                    "Channel has not done the eligibility check for customer";
			                $(".oh_errorPage").find("h2").text("Uh-oh! We're unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "Channel has not done the eligibility check for customer",
			                });
			                break;
			            case "1045":
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Unfortunately, there was an unexpected error. Please try again after sometime"
			                    );
			                $(".oh_errorPage > a").hide();
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "Neither Subscriptionkey nor flag recieved",
			                });
			                break;
			            case "1004":
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Unfortunately, there was an unexpected error. Please try again after sometime"
			                    );
			                $(".oh_errorPage > a").hide();
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3:
			                        "Mandatory field validation failed Due to '||v_remark ||' missing",
			                });
			                break;
			            case "1080":
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Unfortunately, there was an unexpected error. Please try again after sometime"
			                    );
			                $(".oh_errorPage > a").hide();
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "POD requestid is not valid",
			                });
			                break;
			            case "1015":
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Unfortunately, we're unable to process your application. To avail of our EMI Finance option, visit our partner store near you."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .error_store_loc").show();
			                break;
			            case "1016":
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Unfortunately, we're unable to process your application. To avail of our EMI Finance option, visit our partner store near you."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .error_store_loc").show();
			                break;
			            case "1018":
			                retryScenario = "OTPV Stage Not DONE";
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "OTPV Stage Not DONE",
			                });
			                break;
			            case "1021":
			                retryScenario = "OFFER Stage Not DONE";
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "OFFER Stage Not DONE",
			                });
			                break;
			            case "1023":
			                retryScenario = "TNC flag is false";
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "TNC flag is false",
			                });
			                break;
			            case "1025":
			                retryScenario = "UND Stage Not DONE";
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "UND Stage Not DONE",
			                });
			                break;
			            case "1029":
			                retryScenario = "UVC Stage Not DONE";
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "UVC Stage Not DONE",
			                });
			                break;
			            case "1030":
			                retryScenario = "Invalid KYC Status Received";
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			                break;
			            case "1037":
			                retryScenario = "CVC Stage Not DONE";
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "CVC Stage Not DONE",
			                });
			                break;
			            case "1039":
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text(
			                        "We are unable to process your application at the moment. To shop on easy EMIs, visit our partner store near you."
			                    );
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Exclusive offer for you. Buy Wallet Care and secure your debit/credit cards with coverage up to Rs. 2 lacs. Also get an annual Zee5 subscription for free."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("AVAIL OFFER");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGPRL&utm_content=PR1&utm_term=PR2"
			                );
			                break;
			            case "1040":
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "We could not process your Insta EMI Card application due to our credit policies."
			                    );
			                $(".oh_errorPage > a").hide();
			                break;
			            case "1041":
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "We could not process your Insta EMI Card application due to our credit policies."
			                    );
			                $(".oh_errorPage > a").hide();
			                break;
			            case "1042":
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "We could not process your Insta EMI Card application due to our credit policies."
			                    );
			                $(".oh_errorPage > a").hide();
			                break;
			            case "1044":
			                retryScenario = "CVP Stage Not DONE";
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "CVP Stage Not DONE",
			                });
			                break;
			            case "1049":
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Unfortunately, we are unable to process your application. To avail of our EMI Finance option, visit our partner store near you."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .error_store_loc").show();
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "Mobile validation fail",
			                });
			                break;
			            case "1050":
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Unfortunately, we are unable to process your application. To avail of our EMI Finance option, visit our partner store near you."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .error_store_loc").show();
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "PAN validation fail",
			                });
			                break;
			            case "1051":
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Unfortunately, we are unable to process your application. To avail of our EMI Finance option, visit our partner store near you."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .error_store_loc").show();
			                break;
			            case "1056":
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text(
			                        "We are unable to process your application at the moment. To shop on easy EMIs, visit our partner store near you."
			                    );
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Exclusive offer for you. Buy Wallet Care and secure your debit/credit cards with coverage up to Rs. 2 lacs. Also get an annual Zee5 subscription for free."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("AVAIL OFFER");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGPRL&utm_content=PR1&utm_term=PR2"
			                );
			                break;
			            case "1058":
			                $(".page17").show();
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text(
			                        "We are unable to process your application at the moment. To shop on easy EMIs, visit our partner store near you."
			                    );
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Exclusive offer for you. Buy Wallet Care and secure your debit/credit cards with coverage up to Rs. 2 lacs. Also get an annual Zee5 subscription for free."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("AVAIL OFFER");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGPRL&utm_content=PR1&utm_term=PR2"
			                );
			                break;
			            case "1060":
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Unfortunately, we are unable to process your application. To avail of our EMI Finance option, visit our partner store near you."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .error_store_loc").show();
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "Date validation fail",
			                });
			                break;
			            case "1061":
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Unfortunately, we are unable to process your application. To avail of our EMI Finance option, visit our partner store near you."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .error_store_loc").show();
			                break;
			            case "1062":
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Unfortunately, we are unable to process your application. To avail of our EMI Finance option, visit our partner store near you."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .error_store_loc").show();
			                break;
			            case "1063":
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Unfortunately, we are unable to process your application. To avail of our EMI Finance option, visit our partner store near you."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .error_store_loc").show();
			                break;
			            case "1091":
			                $(".oh_errorPage").find("h2").text("Transaction Failed.");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, but your payment was unsuccessful. You can try another payment method. If any money was debited from your account, it will be refunded within 5-7 working days."
			                    );
			                $(".oh_errorPage > a").hide();
			                break;
			            case "1099":
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Unfortunately, we're unable to process your application. To avail of our EMI Finance option, visit our partner store near you."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .error_store_loc").show();
			                break;
			            case "2001":
			                $(".page17").show();
			                retryScenario = "Unexpected Error 2001";
			                $(".oh_errorPage").find("h2").text("There was an unexpected issue.");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "Unexpected Error",
			                });
			                break;
			            case "2002":
			                $(".page1").show();
			                $(".page1 .otpPartMain").show();
			                $("#otp1").val("");
			                $(".a_otpPart .a_optlinMain div").removeClass("active");
			                $(".a_otpPart .errormsg").show();
			                $(".a_otpPart .errormsg").text(
			                    "Please try again with the correct OTP."
			                );
			                $("#cardOtpF2 .btnstyl").removeClass("clicked");
			                break;
			            case "2006":
			                retryScenario = "Payment Success and Card Onboarding In Progress";
			                $(".oh_errorPage").find("h2").text("Your payment is successful.");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Your Insta EMI Card is being created. Please check your card status after 24 hours."
			                    );
			                $(".oh_errorPage .error_retry").hide();
			                $(".oh_errorPage .otheroptioncta").show().text("DOWNLOAD APP");
			                //$(".oh_errorPage .otheroptioncta").attr("href", "https://bfl.onelink.me/857331112/MNDF");
			                $(".oh_errorPage .otheroptioncta").attr(
			                    "href",
			                    appDownloadCTA("https://bfl.onelink.me/857331112/MNDF")
			                );
			                break;
			            case "2009":
			                retryScenario = "OFFER stage already completed";
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "OFFER stage already completed",
			                });
			                break;
			            case "2013":
			                retryScenario = "CVP stage already completed";
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "CVP stage already completed",
			                });
			                break;
			            case "2014":
			                retryScenario = "CPMT stage already completed";
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "CPMT stage already completed",
			                });
			                break;
			            case "2015":
			                retryScenario = "CMND stage already completed";
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "CMND stage already completed",
			                });
			                break;
			            case "2017":
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			                $(".oh_errorPage > a").hide();
			                break;
			            case "2019":
			                retryScenario = "Incomplete CIBIL Score fields";
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Invalid details entered, please try again.");
			                break;
			            case "2020":
			                retryScenario = "CustomerID not provided for ETB";
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Invalid details entered, please try again.");
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "CustomerID not provided for ETB",
			                });
			                break;
			            case "2065":
			                retryScenario = "KYC NOT COMPLETED";
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			                break;
			            case "4010":
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Unfortunately, we don't have an offer for you right now.");
			                $(".oh_errorPage > a").hide();
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "Offer details required",
			                });
			                break;
			            case "4011":
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Unfortunately, we don't have an offer for you right now.");
			                $(".oh_errorPage > a").hide();
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "Invalid Offer Limit",
			                });
			                break;
			            case "4012":
			                $(".oh_errorPage")
			                    .find("h2")
			                    .text("Thank you for showing interest in the EMI Network Card");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Unfortunately, we don't have an offer for you right now.");
			                $(".oh_errorPage > a").hide();
			                break;
			            case "4013":
			                retryScenario = "AdRelationship field is mandatory for CardType = AC";
			                $(".oh_errorPage").find("h2").text("Uh-oh! We're unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Invalid details entered, please retry.");
			                break;
			            case "4014":
			                retryScenario = "Email field is mandatory for CardType = AC";
			                $(".oh_errorPage").find("h2").text("Uh-oh! We're unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Invalid details entered, please retry.");
			                break;
			            case "4015":
			                retryScenario = "CustomerId field is mandatory for CustomerType = ETB";
			                $(".oh_errorPage").find("h2").text("Uh-oh! We're unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text("Invalid details entered, please retry.");
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "CustomerId field is mandatory for CustomerType = ETB",
			                });
			                break;
			            case "5001":
			                retryScenario = "Unable to fetch data from KYC Pod";
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "Unable to fetch data from KYC Pod.",
			                });
			                break;
			            case "5002":
			                retryScenario = "Unexpected error 5002";
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			                newrelic.noticeError(errorCode, {
			                    attribute1: "custom_error",
			                    attribute2: url,
			                    attribute3: "Unexpected error",
			                });
			                break;
			            case "1034":
			                retryScenario = "Unexpected error 1034";
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			                break;
			            case "1921":
			                retryScenario = "Payment status pending";
			                //  $(".oh_errorPage").find("h2").text("Transaction failed.");
			                // $(".oh_errorPage").find("p").text("If any money was debited from your account, it will be refunded within 5-7 working days.");
			                //$(".oh_errorPage").find("h2").text("Transaction Pending");
			                //$(".oh_errorPage").find("p").text("Please wait 24 hours before trying to make another payment if money has already been debited from your account.");
			                break;
			            case "F":
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                retryScenario = "Other error F";
			                $(".oh_errorPage .error_retry").addClass("gotologin");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );
			                break;
			            default:
			                retryScenario = "Default " + message;
			                $(".oh_errorPage").find("h2").text("Unable to proceed");
			                $(".oh_errorPage .error_retry").addClass("gotologin");
			                $(".oh_errorPage")
			                    .find("p")
			                    .text(
			                        "Sorry, we're unable to process your application right now. Try again later."
			                    );

			                if (message == "data key is not present in response") {
			                    mobileNo = mobile.substring(3, 10);
			                    console.log(mobileNo);
			                    newrelic.noticeError(errorCode, {
			                        attribute1: "custom_error",
			                        attribute2: url,
			                        attribute3: message,
			                        attribute4: mobileNo,
			                    }); //put attribute 4
			                } else {
			                    newrelic.noticeError(errorCode, {
			                        attribute1: "custom_error",
			                        attribute2: url,
			                        attribute3: message,
			                    });
			                }
			            /*newrelic.noticeError(errorCode, { attribute1: "custom_error", attribute2: url, attribute3: message });*/
			        }
			    }

			    /* integration on all ajax calls end */

			    $(".pop2Btn button").click(function () {
			        $(this).parents(".activeLaterPop_1").hide();
			        $("body").css("overflow-y", "auto");
			        $(".shopOnSlider").slick("refresh");
			    });

			    $(".page9 .checkConfirm label input").change(function () {
			        if (!$(this).is(":checked")) {
			            $(".activeLaterPop_1").css("display", "flex");
			            $("body").css("overflow-y", "hidden");
			        }
			    });

			    $(".checkConfirm label input").click(function () {
			        if (!$(this).is(":checked")) {
			            $(this).parents("label").removeClass("checked");
			            $(this).parents("label").addClass("unchecked");
			        } else {
			            $(this).parents("label").addClass("checked");
			            $(this).parents("label").removeClass("unchecked");
			        }
			    });
				//read more or less  
			    $(".checkReadML label input").click(function () {
			    	console.log("Read More......");
			    	
			        if (!$(this).is(":checked")) {
			        	setCookie("productOfferingType", 0);
			        	
			        	$(this).parents("label").removeClass("checked");
			            $(this).parents("label").addClass("unchecked");
			        } else {
			        	setCookie("productOfferingType", 1);
			        	
			        	$(this).parents("label").addClass("checked");
			            $(this).parents("label").removeClass("unchecked");
			        }
			    });
			    
			    $(".buttonPart_1 .downloadcta").click(function () {
			        clickText = $(this).text();
			        var PageURL = $(location).attr("href");
			        var customer_city = getCookie("tvc_user_city");
			        errorPageCTADataLayerCall(
			            clickText,
			            "ETB",
			            "https://bfl.onelink.me/857331112/etb1",
			            PageURL,
			            customer_city,
			            "1919"
			        );
			    });

			    $(".buttonPart_1 .shoponlineinsta").click(function () {
			        clickText = $(this).text();
			        var PageURL = $(location).attr("href");
			        var customer_city = getCookie("tvc_user_city");
			        errorPageCTADataLayerCall(
			            clickText,
			            "ETB",
			            "https://www.bajajmall.in/emi-store?utm_source=bfl_website&utm_medium=referral&utm_campaign=mkt_emi_pod_etb_active",
			            PageURL,
			            customer_city,
			            "1920"
			        );
			    });

			    $(".etbactivecl1").click(function () {
			        clickText = $(this).text();
			        var PageURL = $(location).attr("href");
			        var customer_city = getCookie("tvc_user_city");
			        errorPageCTADataLayerCall(
			            clickText,
			            "ETB",
			            "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGETAC&utm_content=E1&utm_term=E2",
			            PageURL,
			            customer_city,
			            "1920"
			        );
			    });

			    $(".etbactivecl2").click(function () {
			        clickText = $(this).text();
			        var PageURL = $(location).attr("href");
			        var customer_city = getCookie("tvc_user_city");
			        errorPageCTADataLayerCall(
			            clickText,
			            "ETB",
			            "https://bit.ly/3sSgDCb",
			            PageURL,
			            customer_city,
			            "1920"
			        );
			    });

			    $(".etbinactivecl1").click(function () {
			        clickText = $(this).text();
			        var PageURL = $(location).attr("href");
			        var customer_city = getCookie("tvc_user_city");
			        errorPageCTADataLayerCall(
			            clickText,
			            "ETB",
			            "https://bit.ly/3wFCTBj",
			            PageURL,
			            customer_city,
			            "1919"
			        );
			    });

			    $(".etbinactivecl2").click(function () {
			        clickText = $(this).text();
			        var PageURL = $(location).attr("href");
			        var customer_city = getCookie("tvc_user_city");
			        errorPageCTADataLayerCall(
			            clickText,
			            "ETB",
			            "https://www.bajajfinserv.in/marketplace/pocketInsurance/?product=WalletCare%20&product_code=WCE1&variant=null&utm_source=EMIPMG&utm_medium=SMS&utm_campaign=PMGETIn&utm_content=I1&utm_term=I2",
			            PageURL,
			            customer_city,
			            "1919"
			        );
			    });

			    $(".buttonPart_2 .downloadcta").click(function () {
			        clickText = $(this).text();
			        var PageURL = $(location).attr("href");
			        var customer_city = getCookie("tvc_user_city");
			        errorPageCTADataLayerCall(
			            clickText,
			            "ETB",
			            "https://bfl.onelink.me/857331112/etb1",
			            PageURL,
			            customer_city,
			            "1919"
			        );
			    });
			});

			function trackPageView(stepValue) {
			    window._uxa = window._uxa || [];
			    window._uxa.push([
			        "trackPageview",
			        window.location.pathname +
			        window.location.hash.replace("#", "?__") +
			        "?cs-form-step=" +
			        stepValue,
			    ]);
			}

			function submitDataLayerCall(
			    sectionTitle,
			    pageTitle,
			    eventCondition,
			    clickText
			) {
			    dataLayer.push({
			        event: "button_click",
			        pageType: pageTitle,
			        sectionTitle: sectionTitle,
			        eventCondition: eventCondition,
			        clickText: clickText,
			    });
			}

			function PODRequestsubmitDataLayerCall(
			    sectionTitle,
			    pageTitle,
			    eventCondition,
			    clickText,
			    podRequestId
			) {
			    dataLayer.push({
			        event: "button_click",
			        pageType: pageTitle,
			        sectionTitle: sectionTitle,
			        eventCondition: eventCondition,
			        clickText: clickText,
			        pod_request_id: podRequestId,
			    });
			}

			function cardClickDataLayerCall(
			    sectionTitle,
			    pageTitle,
			    eventCondition,
			    clickText
			) {
			    dataLayer.push({
			        event: "card_click",
			        pageType: pageTitle,
			        sectionTitle: sectionTitle,
			        eventCondition: eventCondition,
			        clickText: clickText,
			    });
			}

			function faqClickDataLayerCall(
			    pageTitle,
			    sectionTitle,
			    eventCondition,
			    clickText
			) {
			    dataLayer.push({
			        event: "dropdown_click",
			        pageType: pageTitle,
			        sectionTitle: sectionTitle,
			        eventCondition: eventCondition,
			        clickText: clickText,
			    });
			}

			function linkClickDataLayerCall(
			    sectionTitle,
			    pageTitle,
			    eventCondition,
			    clickText
			) {
			    dataLayer.push({
			        event: "link_click",
			        pageType: pageTitle,
			        sectionTitle: sectionTitle,
			        eventCondition: eventCondition,
			        clickText: clickText,
			    });
			}

			function fieldValueDataLayerCall(formName, fieldName, fieldValue) {
			    dataLayer.push({
			        event: "fieldValue",
			        formName: formName,
			        fieldName: fieldName,
			        fieldValue: fieldValue,
			    });
			}

			function fieldTimingDataLayerCall(
			    eventAction,
			    eventLabel,
			    formName,
			    eventValue
			) {
			    dataLayer.push({
			        event: "fieldTiming",
			        eventCategory: "Form Analytics Actions",
			        eventAction: eventAction,
			        eventLabel: eventLabel,
			        formName: formName,
			        eventValue: eventValue,
			    });
			}

			function errorPageCTADataLayerCall(
			    eventLabel,
			    customerType,
			    destination_url,
			    pageURL,
			    customer_city,
			    sectionName
			) {
			    dataLayer.push({
			        event: "error_page_cta_click",
			        eventCategory: "Apply Online for Bajaj Finserv Insta EMI Network Card",
			        eventAction: "CTA Click",
			        eventLabel: eventLabel,
			        customerType: customerType,
			        destination_url: destination_url,
			        pageURL: pageURL,
			        customer_city: customer_city,
			        sectionName: sectionName,
			    });
			}

			function errorPageBannerDataLayerCall(
			    eventLabel,
			    customerType,
			    destination_url,
			    pageURL,
			    customer_city,
			    sectionName
			) {
			    dataLayer.push({
			        event: "error_page_banner_click",
			        eventCategory: "Apply Online for Bajaj Finserv Insta EMI Network Card",
			        eventAction: "Banner Click",
			        eventLabel: eventLabel,
			        customerType: customerType,
			        destination_url: destination_url,
			        pageURL: pageURL,
			        customer_city: customer_city,
			        sectionName: sectionName,
			    });
			}

			function decryptedvalue(encryptresponse) {
			    var key = CryptoJS.enc.Utf8.parse("eThWmZq4t7w9z$C&F)J@NcRfUjXn2r5u");
			    var iv = CryptoJS.enc.Utf8.parse("01234567Xgfedcba");
			    var ciphertext = CryptoJS.enc.Base64.parse(encryptresponse);
			    console.log("ciphertext : " + ciphertext);
			    var encryptedCP = CryptoJS.lib.CipherParams.create({
			        ciphertext: ciphertext,
			        formatter: CryptoJS.format.OpenSSL,
			    });
			    console.log("encryptedCP::::" + encryptedCP);
			    var decryptedWA = CryptoJS.AES.decrypt(encryptedCP, key, {
			        iv: iv,
			    });
			    console.log("decryptedWA::::" + decryptedWA);
			    var encryptedBase64 = encryptedCP.toString();
			    var decryptedUtf8 = decryptedWA.toString(CryptoJS.enc.Utf8);
			    //var decryptedUtf8 = CryptoJS.enc.Utf8.stringify(decryptedWA);
			    console.log("Ciphertext (Base64)  : " + encryptedBase64);
			    console.log("Decrypted data (Utf8): " + decryptedUtf8);
			    return decryptedUtf8;
			}

			function amtpaytooltip() {
			    $(".amountpay_BG").hide();
			    $(".amountpay_RU p strong a")
			        .parents(".amountpay_RU")
			        .siblings(".amountpay_BG")
			        .show();
			}

			$(".faqPartPopInner > h2 > a").click(function () {
			    $(this).parents(".faqPartPop").hide();
			});

			$(".needAssistance ul li a").click(function () {
			    $(".faqPartPop").css("display", "flex");
			});

			window.addEventListener("mouseup", function (event) {
			    var ipopup = document.getElementById("ipopup");
			    if (event.target != ipopup && event.target.parentNode != ipopup) {
			        ipopup.style.display = "none";
			    }
			});

			var utmDealerArray = [
			    "13870_SNEHANJALI RETAIL PVT LTD",
			    "14227_ARCEE ELECTRONICS",
			    "337641_HELLO MOBILES PRIVATE LIMITED",
			    "78448_MEHTA RETAIL PVT LTD",
			];

			function instaLinkUtmMapping(qrCampaign) {
			    var dealerMatch = false;
			    for (var c = 0; c < utmDealerArray.length; c++) {
			        if (qrCampaign === utmDealerArray[c]) {
			            console.log("dealer from array: " + utmDealerArray[c]);
			            dealerMatch = true;
			            break;
			        } else {
			            console.log("continue");
			            continue;
			        }
			    }
			    return dealerMatch;
			}
			  /*19 APRIL 2022 slick change 17:34 */
			/* 22 APRIL 2022 */
			/* 02 May 2022 */
			/* 04 May 2022 */
			/* 05 May 2022 */
			/* 24 May 2022 */
			/* 28 May 2022 */
			/* 03 June 2022 */
			/* 29 June 2022 */
			/* 06 JULY 2022 */
			/* 07 JULY 2022  4:00 pm */
			/* 05 SEP 2022 */
			/* 31 OCT 2022 */
			var keySize = 256;
			var iterations = 100;
			var pkd = "secrete";

			function getCookiee(cname) {
			    var name = cname + "=";
			    var decodedCookie = decodeURIComponent(document.cookie);
			    var ca = decodedCookie.split(';');
			    for (var i = 0; i < ca.length; i++) {
			        var c = ca[i];
			        while (c.charAt(0) == ' ') {
			            c = c.substring(1);
			        }
			        if (c.indexOf(name) == 0) {
			            return c.substring(name.length, c.length);
			        }
			    }
			    return "";
			}

			function decrypte(transitmessage, dk) {
			    var nmk = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
			    var tv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
			    var encrypted = transitmessage.substring(64);
			    var chb = CryptoJS.PBKDF2(dk, nmk, {
			        keySize: keySize / 32,
			        iterations: iterations
			    });
			    var decrypted = CryptoJS.AES.decrypt(encrypted, chb, {
			        iv: tv,
			        padding: CryptoJS.pad.Pkcs7,
			        mode: CryptoJS.mode.CBC
			    })
			    return decrypted;
			}

			function generateSVale(length) {
			    var chars = "0123456789ABCDEFabcdef";
			    var sVal = '';
			    for (var i = 0; i < length; i++) {
			        var appendchar = chars.charAt(Math.floor(Math.random() * (chars.length)));
			        sVal = sVal + appendchar;
			    }
			    return sVal;
			}

			function encptedata(sVal, reqData) {
			    var iterationCount = 1000;
			    var keySize = 256;
			    var passphrase = "48a4833ce7";
			    iv = "04843306e4780ccf4480c0ee752e9521";
			    var aesUtil = new AesUtil(keySize, iterationCount);
			    return aesUtil.encrypt(sVal, iv, passphrase, reqData);
			}
			$('.Exclusive_Offers_inner_1 > a').click(function () {
			    WCMLeadCaptureClick();
			});


			function WCMLeadCaptureClick(responseFromApi, url, referID) {
			    console.log(url);
			    var datalist;
			    var offers = "",
			        amount = "",
			        lineStatus = "",
			        firsttransactionlimit = "",
			        parentNameform = "",
			        currentStage = "",
			        nextStage = "";
			    var fullname = "",
			        date_of_birth = "",
			        pincode = "",
			        pancard = "",
			        occupation = "",
			        gender = "";  

			    if (referID != "Partial form save" && referID != "View Card" && referID != "Pay Initiate" && referID != "Mandate Initiate") {
			        var msge = responseFromApi.data.message;
			        var fields = msge.split('|');
			        lineStatus = fields[0];
			        offers = fields[1];
			        currentStage = responseFromApi.data.currentStage;
			        nextStage = responseFromApi.data.nextStage;
			    }

			    if (referID == "Partial form save") {
			        fullname = $('#fullname').val();
			        date_of_birth = $('#birthDate').val();
			        var fields = date_of_birth.split('/');
			        var dd = fields[0];
			        var mm = fields[1];
			        var yyyy = fields[2];
			        date_of_birth = yyyy + "-" + mm + "-" + dd;
			        currentStage = "OTPV";
			        nextStage = "APLF";
			        offers = "Not available";
			        amount = "Not available";
			        lineStatus = "Not available";
			    }
			    if (referID == "View Card") {
			        var custdob = getCookie('encDB');
			        if (custdob != null && custdob != undefined && custdob != "") {
			            var decryptCustDob = decrypte(custdob, pkd);
			            custdob = decryptCustDob.toString(CryptoJS.enc.Utf8);
			            date_of_birth = custdob;
			        } else {
			            date_of_birth = "Not available";
			        }
			        parentNameform = url;
			        currentStage = "CCP";
			        nextStage = "CMND";
			        offers = "Not available";
			        amount = "Not available";
			        lineStatus = "Not available";
			    }
			    if (referID == "Pay Initiate") {
			        var custdob = getCookie('encDB');
			        if (custdob != null && custdob != undefined && custdob != "") {
			            var decryptCustDob = decrypte(custdob, pkd);
			            custdob = decryptCustDob.toString(CryptoJS.enc.Utf8);
			            date_of_birth = custdob;
			        } else {
			            date_of_birth = "Not available";
			        }
			        parentNameform = url;
			        currentStage = "CVP";
			        nextStage = "CPMT";
			        offers = "Not available";
			        amount = "Not available";
			        lineStatus = "Not available";
			    }
			    if (referID == "Mandate Initiate") {
			        var custdob = getCookie('encDB');
			        if (custdob != null && custdob != undefined && custdob != "") {
			            var decryptCustDob = decrypte(custdob, pkd);
			            custdob = decryptCustDob.toString(CryptoJS.enc.Utf8);
			            date_of_birth = custdob;
			        } else {
			            date_of_birth = "Not available";
			        }
			        parentNameform = url;
			        currentStage = "CCP";
			        nextStage = "CMND";
			        offers = "Not available";
			        amount = "Not available";
			        lineStatus = "Not available";
			    }

			    //OTP Validate
			    if (url == "api/v1/iemi/otpverify" || url == "api/v1/iemi/retry") {
			    	
			        if (nextStage == "UVC" || nextStage == "CVC" || nextStage == "CVP" ||
			            nextStage == "CPMT" || nextStage == "CMND" || nextStage == "CPLT") {
			            fullname = responseFromApi.data.lastStageData.customerName;
			            amount = responseFromApi.data.lastStageData.cardLimit;
			            firsttransactionlimit = responseFromApi.data.lastStageData.firstTransactionLimit;
			        }
			    }

			    //Form Submission
			    if (url == "api/v1/iemi/und") {
			        if (nextStage == "UVC") {
			            amount = responseFromApi.data.cardLimit;
			            firsttransactionlimit = responseFromApi.data.firstTransactionLimit;
			            var chrcookie = getCookie('insta_chr_Cookie');
			            var instadata;
			            console.log(chrcookie);
			            if (chrcookie != null && chrcookie != '' && chrcookie != undefined) {
			                instadata = chrcookie;
			                var decryptData = decrypte(instadata, pkd);
			                instadata = decryptData.toString(CryptoJS.enc.Utf8);
			                instadata = JSON.parse(instadata);
			                fullname = instadata.customerFullName;
			                var dob = instadata.dob;
			                var fields = dob.split('/');
			                var dd = fields[0];
			                var mm = fields[1];
			                var yyyy = fields[2];
			                date_of_birth = yyyy + "-" + mm + "-" + dd;
			                pancard = instadata.pan;
			                pincode = instadata.pincode;
			                gender = instadata.gender;
			                occupation = instadata.occupation;
			            }
			        } 
			    }
			    //KYC Initiate
			    if (url == "api/v1/iemi/undaccept") {
			        var custdob = getCookie('encDB');
			        if (custdob != null && custdob != undefined && custdob != "") {
			            var decryptCustDob = decrypte(custdob, pkd);
			            custdob = decryptCustDob.toString(CryptoJS.enc.Utf8);
			            date_of_birth = custdob;
			        } else {
			            date_of_birth = "Not available";
			        }
			        amount = "Not available";
			        lineStatus = "Not available";
			    }

			    if (url == "api/v1/iemi/confirmkyc") {
			        var custdob = getCookie('encDB');
			        if (custdob != null && custdob != undefined && custdob != "") {
			            var decryptCustDob = decrypte(custdob, pkd);
			            custdob = decryptCustDob.toString(CryptoJS.enc.Utf8);
			            date_of_birth = custdob;
			        } else {
			            date_of_birth = "Not available";
			        }
			        amount = "Not available";
			        if (currentStage == null || currentStage == "" || currentStage == undefined) {
			            currentStage = "Not available";
			        }
			    }
			    if (url == "api/v1/iemi/payment") {
			        var custdob = getCookie('encDB');
			        if (custdob != null && custdob != undefined && custdob != "") {
			            var decryptCustDob = decrypte(custdob, pkd);
			            custdob = decryptCustDob.toString(CryptoJS.enc.Utf8);
			            date_of_birth = custdob;
			        } else {
			            date_of_birth = "Not available";
			        }
			        amount = responseFromApi.data.cardLimit;
			        if (currentStage == null || currentStage == "" || currentStage == undefined) {
			            currentStage = "Not available";
			        }
			    }
			    if (url == "api/v1/iemi/mandate") {
			        var custdob = getCookie('encDB');
			        if (custdob != null && custdob != undefined && custdob != "") {
			            var decryptCustDob = decrypte(custdob, pkd);
			            custdob = decryptCustDob.toString(CryptoJS.enc.Utf8);
			            date_of_birth = custdob;
			        } else {
			            date_of_birth = "Not available";
			        }
			        amount = "Not available";
			        if (currentStage == null || currentStage == "" || currentStage == undefined) {
			            currentStage = "Not available";
			        }
			        if (nextStage == null || nextStage == "" || nextStage == undefined) {
			            nextStage = "Not available";
			        }
			    }

			    var podRequestId = getCookiee('pRI');
			    if (podRequestId != undefined && podRequestId != "" && podRequestId != null) {
			        var decryptpod = decrypte(podRequestId, pkd);
			        podRequestId = decryptpod.toString(CryptoJS.enc.Utf8);
			    }
			    var mobile = getCookiee('Zme');
			    if (mobile != undefined && mobile != "" && mobile != null) {
			        var decryptmobile = decrypte(mobile, pkd);
			        mobile = decryptmobile.toString(CryptoJS.enc.Utf8);
			    }
			    var utmnewcookie = getCookiee('utm_new_cookie');
			    console.log("utm_new_cookie :" + JSON.stringify(utmnewcookie));
			    var utmCampaignUtmTrue, utmMediumUtmTrue, utmSourceUtmTrue;
			    if (utmnewcookie != null) {
			        utmnewcookie = JSON.parse(utmnewcookie);
			        utmCampaignUtmTrue = utmnewcookie['utm_campaign'];
			        utmMediumUtmTrue = utmnewcookie['utm_medium'];
			        utmSourceUtmTrue = utmnewcookie['utm_source'];
			    } else {
			        utmCampaignUtmTrue = 'website';
			        utmMediumUtmTrue = 'bfl';
			        utmSourceUtmTrue = 'organic_bfl';
			    }
			    var lastclick = getCookie('LastClickCookie');
			    if (lastclick != null && lastclick != "" && lastclick != undefined) {
			        lastclick = JSON.parse(lastclick);
			        lastClickedClickTrue = lastclick.click;
			    } else {
			        lastClickedClickTrue = 'Not available';
			    }
			    var device = getCookie('tvc_device_details');
			    if (device != null && device != "" && device != undefined) {
			        device = JSON.parse(device);
			        deviceTrue = device.dc;
			    } else {
			        deviceTrue = 'Not available';
			    }
			    var gid = getCookie('_ga');
			    if (gid != null && gid != "" && gid != undefined) {
			        clientId = gid;
			    } else {
			        clientId = 'Not available';
			    }
			    var custType = getCookie('CType');
			    if (custType != null && custType != "null" && custType != "" && custType != undefined) {
			        cust_type = custType;
			    } else {
			        cust_type = 'Not available';
			    }
			    var enquiryDate = new Date();

			    var TokenCSRF = getCookiee('CSRFtoken');
			    var Pageurl = getCookiee('pageurl');
			    console.log("amount: " + amount + " data type of amount: " + typeof amount);
			    console.log("firsttransactionlimit: " + firsttransactionlimit + " data type of firsttransactionlimit: " + typeof firsttransactionlimit);
			    var datalist = {
			        "mobileNo": mobile,
			        "utmSourceUtmTrue": utmSourceUtmTrue,
			        "utmMediumUtmTrue": utmMediumUtmTrue,
			        "utmCampaignUtmTrue": utmCampaignUtmTrue,
			        "deviceTrue": deviceTrue,
			        "clientId": clientId,
			        "lastClickedClickTrue": lastClickedClickTrue,
			        "formNameForm": "Insta EMI POD 2",
			        "formId": "1501216059707",
			        "otpSource": "WEBSITE",
			        "pageNameForm": "IEMI PMG",
			        "pageUrlTrue": Pageurl,
			        "offers": offers,
			        "amount": String(amount),
			        "product": "CaptureIntCall",
			        "interestOffers": currentStage,
			        "dateOfBirthDateTrue": date_of_birth,
			        "pincodePincodeTrue": pincode,
			        "fullNameFullNameTrue": fullname,
			        "genderRadioTrue": gender,
			        "typeOfOccupationDropdownTrue": occupation,
			        "lineStatus": lineStatus,
			        "panCardPanCardTrue": pancard,
			        "maximumLoanAvailedNumberTrue": String(firsttransactionlimit),
			        "customerRefno": cust_type, 
			        "parentNameform": parentNameform,
			        "enquiryDate": enquiryDate,
			        "referID": referID,
			        "offerStatus": nextStage,
			        "cidValueCidValueTrue": podRequestId,
			        "productOfferingType": getCookie("productOfferingType")     
			    };
			    console.log(JSON.stringify(datalist));
			    var sVal = generateSVale(20);
			    var encptReqVal = encptedata(sVal, JSON.stringify(datalist));
			    var requestData = {
			        "reqData": encptReqVal,
			        "_csrf": TokenCSRF
			    };
			    $.ajax({
			        url: "https://devwebservices.bajajfinserv.in/api/v1/iemi/captureinterest",
			        type: "POST",
			        data: JSON.stringify(requestData),
			        headers: {
			            "Content-Type": "application/json",
			            "reqKey": sVal,
			            "source": "IEMI POD2 PMG",
			            "urlPath": "insta-emi-network-card-apply-online"
			        },
			        crossDomain: true,
			        timeout: 35000,
			        xhrFields: {
			            "withCredentials": "true"
			        },
			        error: function (responseFromApi) {
			            console.log("lead not captured");
			        },
			        success: function (responseFromApi) {
			            console.log("response: " + JSON.stringify(responseFromApi));
			            console.log("lead Captured Successfully");
			        }
			    });
			}
			
			/* Added on 30-JAN-2023 */
			
			
				
			  			
			
			/* Added new apiCAll on 16-JAN-2023  */
			
			function RBLCaptureInterest() {
				
				var mobile = getCookiee('Zme');
			    if (mobile != undefined && mobile != "" && mobile != null) {
			        var decryptmobile = decrypte(mobile, pkd);
			        mobile = decryptmobile.toString(CryptoJS.enc.Utf8);
			    }
				
			    var gid = getCookie('_ga');
			    if (gid != null && gid != "" && gid != undefined) {
			        clientId = gid;
			    } else {
			        clientId = 'Not available';
			    }
			    
			    var device = getCookie("tvc_device_details");
			    var deviceTrue;
		        if (device != null && device != "" && device != undefined) {
		            device = JSON.parse(device);
		            deviceTrue = device.dc;
		        } else {
		            deviceTrue = "Not available";
		        }
			    
			    var TokenCSRF = getCookiee('CSRFtoken');
			    var Pageurl = getCookiee('pageurl');		    
			    
				//icors offerapi
				var datalist = {
				  "mobileNo": mobile ,
				  "sourceId": "3",
				  "_csrf": TokenCSRF
				}
				
				var sVal = generateSVale(20);
			    var encptReqVal = encptedata(sVal, JSON.stringify(datalist));
			    var requestData = {
			        "reqData": encptReqVal,
			        "_csrf": TokenCSRF
			    };
				
				console.log(JSON.stringify(datalist));
			    $.ajax({
			        url: " https://uatwebservices.bajajfinserv.in/api/v2/offers2",
			        type: "POST",
			        contentType: 'application/json',
			        data: JSON.stringify(requestData),
			        timeout: 35000,
			        headers: {
			            "Content-Type": "application/json",
			            "reqKey": sVal,
			            "source": "IEMI POD2 PMG",
			            "urlPath": "insta-emi-network-card-apply-online"
			        },
			        crossDomain: true,
			        timeout: 35000,
			        xhrFields: {
			            "withCredentials": "true"
			        },
			        error: function (response) {
			            console.log("rbl lead not captured");
			        },
			        success: function (response) {
			            console.log("rbl lead Captured Successfully");
			            console.log("Response"+response);
			             			            			           
			            var icors_offer_type , display_name;  
			            
			            if( icors_offer_type == 'credit_card_oms' && display_name == 'RBL'){
			            	
			            	var datalistCaptureInterest = {
				    		  "mobileNo": mobile, 
				    		  "_csrf": TokenCSRF, 
				    		  "formNameForm": "Insta_EMI_RBL_CC", 
				    		  "formId": "CreditCardRBL_DBSForm12345", 
				    		  "otpSource": "WEBSITE", 
				    		  "utmContentUtmTrue": "null",
				    		  "utmCampaignUtmTrue": "Web_application_DBS", 
				    		  "utmMediumUtmTrue": "Website_DBSxSellRBL", 
				    		  "utmKeywordUtmTrue": "null",
				    		  "utmSourceUtmTrue": "E2E Interested", 
				    		  "lastClickedClickTrue": "/insta-emi-card", 
				    		  "clientId": clientId, 
				    		  "deviceTrue": deviceTrue,   
				    		  "pageUrlTrue": Pageurl,    
				    		  "uniqueCode": "", 
				    		  "wcmtime": "", 
				    		  "createon": ""
				    		}

						    var sVal = generateSVale(20);
						    var encptReqVal = encptedata(sVal, JSON.stringify(datalist));
						    var requestData = {
						        "reqData": encptReqVal,
						        "_csrf": TokenCSRF
						    };
						    $.ajax({
						        url: "https://devwebservices.bajajfinserv.in/api/v1/iemi/captureinterest",
						        type: "POST",
						        data: JSON.stringify(requestData),
						        headers: {
						            "Content-Type": "application/json",
						            "reqKey": sVal,
						            "source": "IEMI POD2 PMG",
						            "urlPath": "insta-emi-network-card-apply-online"
						        },
						        crossDomain: true,
						        timeout: 35000,
						        xhrFields: {
						            "withCredentials": "true"
						        },
						        error: function (responseFromApi) {
						            console.log("lead not captured");
						        },
						        success: function (responseFromApi) {
						            console.log("response: " + JSON.stringify(responseFromApi));
						            console.log("lead Captured Successfully");
						        }
						    });
			            	
			            	
			            }
			            
			        }
			    });
				
			    
			}
			

			function transunionLeadCaptureInsta(case_id, otpverified, softapproval) {
			    var datalist = {
			        "username": "BajajInstaEMI",
			        "password": "$2a$10$5fEZOPdZym7HGd6Y7Snxl.zaBzG2yYUFl5sE8BS7TvkiOd4MFRyem",
			        "utm_source_id": "Partner",
			        "campaign_id": "1",
			        "case_id": "case_id",
			        "is_otp_verified": otpverified,
			        "is_soft_approval": softapproval
			    };
			    console.log(JSON.stringify(datalist));
			    $.ajax({
			        url: "/formsintegration/CaptureLeadStatus",
			        type: "POST",
			        contentType: 'application/json',
			        data: JSON.stringify(datalist),
			        timeout: 35000,
			        error: function (response) {
			            console.log("lead not captured");
			        },
			        success: function (response) {
			            console.log("lead Captured Successfully");
			        }
			    });
			}
			/* 05 JULY 2022 */
			/* 22 JULY 2022 */
			/* 22 OCT 2022 */
			/* 31 OCT 2022 */
			