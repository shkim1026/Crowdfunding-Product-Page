//Calculates 56 days from current date
Date.prototype.addDays = function(days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
let date = new Date();
let fundsEndDate = date.addDays(56);

// Adds comma to every thousandth digit
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


/////////////////////////////////////////////////////////////////////////////////


// Mock backend information set by client (i.e. Mastercraft)
let clientFunds = 89914;
let clientFundsGoal = 100000;
let clientDeadline = fundsEndDate; //set to 56 days ahead indefinitely for this project
let clientStockOne = 101;
let clientStockTwo = 64;
let clientStockThree = 0


/////////////////////////////////////////////////////////////////////////////////


// Calculates days left from current date to client's deadline
let differenceInTime = date.getTime() - clientDeadline.getTime();
let differenceInDays = differenceInTime / (1000 * 3600 * 24);

//Variables: Funding information
let currentFunds = clientFunds;
console.log('currentFunds', currentFunds)
let fundsGoal = clientFundsGoal;
let goalProgress = (currentFunds / fundsGoal) * 100;
let goalPercentage = goalProgress + '%';

let totalBackers = 5007;
let daysLeft = differenceInDays;


//Variables: Number of Customer Rewards Remaining
let tier1Stock = clientStockOne;
let tier2Stock = clientStockTwo;
let tier3Stock = clientStockThree;


/////////////////////////////////////////////////////////////////////////////////
// DOM SCRIPTS
/////////////////////////////////////////////////////////////////////////////////

//Places funding information on the DOM (".status-card")
function displayBackingInfo() {
    $('.current-funds').text("$" + numberWithCommas(clientFunds));  //Total Funds
    $('.backers').text(numberWithCommas(totalBackers));  //Total Backers
    $('.days-left').text(numberWithCommas(daysLeft)); //Days Left
    $('.days-left').text( $('.days-left').text().replace('-','') ); //removes '-' 
    $('.progress-bar-fill').css('width', goalPercentage);
}
displayBackingInfo();

//Places number of donation rewards on the DOM (".pledge-remaining")
$('.tier-1-stock').text(tier1Stock);
$('.tier-2-stock').text(tier2Stock);
$('.tier-3-stock').text(tier3Stock);

//Grays out donation tier when there is a quantity of 0
$('.pledge-remaining').each(function() {
    if ($(this).text() === '0') {
        $(this).parent().parent().css('opacity', '0.5');
        $(this).parent().prev().prev().first().disabled = true;
        $(this).closest('.tier-container').find('.radio').attr('disabled', true)
    }
    //Removes "x left" from modal when tier reward quantity is unlimited
    if ($(this).text().length < 1) {
        $(this).parent().css('display', 'none');
    }
});

//Opens 'Select Donation' modal (2 buttons)
$('.support-project-button').click(function(){
    $('.selection-modal').toggleClass('display');
    $('#tier-0').prop('checked', true);
    $('#tier-0').parent().siblings('.donation-selected-container').toggleClass('display');
});

// Selects corresponding reward tier for modal
$('.select-button').click(function(){
    $('.selection-modal').toggleClass('display');
    for (let i = 1; i < 4; i++) {
        if ($(this).attr('id') == `select-tier-${i}`) {
            $(`#tier-${i}`).prop('checked', true)
            $(`#tier-${i}`).parent().siblings('.donation-selected-container').toggleClass('display');
        }
    }
});

//Closes modal on 'X'
$('.close-icon-modal').click(function(){
    $(this).closest('.modal').toggleClass('display');
});

// Disables symbols in donation input field
$('#donation-input').keypress(function(e) {
    var txt = String.fromCharCode(e.which);
    if (!txt.match(/[A-Za-z0-9&. ]/)) {
        return false;
    }
});

//Limits Donation input to the hundredth decimal
let decimal = function(e) {
    let t = e.value;
    e.value = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)) : t;
}

//Updates funding information
function updateBackendInformation() {
    currentFunds = clientFunds;
    console.log('currentFunds', currentFunds)
    fundsGoal = clientFundsGoal;
    goalProgress = (currentFunds / fundsGoal) * 100;
    goalPercentage = goalProgress + '%';
}

//Opens Success Modal and updates the reward stock
$('.donate-button').click(function(){
    let donationValueStr = $(this).siblings().children('#donation-input').val()
    let donationValueInt = parseInt(donationValueStr, 10);
    // Subtracts 1 from corresponding rewards remaining when donation is completed 
    let buttonId = $(this).attr('id');
    let tierNumber = buttonId.substr(-1);
    const donationTiers = {
        1: 25,
        2: 75,
        3: 200
    }
    minimumDonation(tierNumber, donationValueStr, donationTiers)
    console.log(donationTiers[1])
    function minimumDonation(tierNumber, donationValueStr, donationTiers) {
        if (parseInt(donationValueStr) < donationTiers[tierNumber]) {
            alert(`Please enter donation of at least: $${donationTiers[tierNumber]}`)
            return;
        } else {
            if (tierNumber === 1) {
                tier1Stock--;
            } else if (tierNumber ===2) {
                tier2Stock--;
            } else {
                tier3Stock--;
            }
            $(`.tier-${tierNumber}-stock`).text()
        }
    }
    clientFunds += donationValueInt;
    totalBackers++;
    updateBackendInformation();
    displayBackingInfo();
    $('.success-modal').toggleClass('display-block');
    $('.progress-bar-fill').css('width', goalPercentage);
    console.log('goalPercentage', goalPercentage)
});

//Displays donation input for selected pledge reward
$('.radio').click(function(){
    $('.donation-selected-container').removeClass('display');
    $(this).parent().siblings('.donation-selected-container').toggleClass('display');
});

//Closes all modals after donation is successful
$('.success-button').click(function(){
    $('.donation-selected-container').removeClass('display');
    $('.selection-modal').removeClass('display');
    $('.success-modal').toggleClass('display-block');
});

// Toggles navigation menu in hamburger (mo*+bile)
$('.hamburger-icon, .close-icon-navbar').click(function() {
    $('.hamburger-icon').toggleClass('display-none');
    $('.close-icon-navbar').toggleClass('display-block');
    $('.nav-links-container').toggleClass('display-grid');
    $('.nav-links').toggleClass('display-grid');
});

//Changes 'Bookmark' button text to 'Bookmarked' on click
$('.bookmark-links-div').click(function() {
    if ($('.bookmark-text-button').text() == 'Bookmark') {
        $('.bookmark-text-button').text('Bookmarked');
        $('.bookmark-text-button').css('color', 'hsl(176, 72%, 28%)');
        $('.bookmark-icon').css('filter', 'invert(106%) sepia(51%) saturate(2623%) hue-rotate(481deg) brightness(42%) contrast(80%)');
    } else {
        $('.bookmark-text-button').text('Bookmark');
        $('.bookmark-text-button').css('color', 'hsl(0, 0%, 48%)');
        $('.bookmark-icon').css('filter', 'invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)');
    }
});
