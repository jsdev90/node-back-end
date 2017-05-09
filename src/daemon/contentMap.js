"use strict";

var threeDayNotice = "We hope you have been enjoying your time with Aries. You’re down to the " +
"last 3 days of the free trial. If you don’t wish to continue with Aries you won’t have to do " +
"anything, the trial will expire on its own. However, if you would like to continue please follow" +
"the PayPal link below to setup your account. You will go on a recurring payment plan that will" +
"be taken from your account each month on the day you made your first payment. For example, " +
"if you made your first payment on the 19th, you will be charged each month on the 19th. " +
"If you have any questions on this process please don't hesitate to contact us.";

var trialEnds = "Today is the final day of your free trial of Aries. If you would like to " +
"continue using Aries please follow the link provided below to maintain uninterrupted service " +
"with us. If you are unable to subscribe at this time don’t worry, we will keep all your reports " +
"and everything just like you left it. At any time you decide to return you can continue right " +
"where you left off.";

var accountSuspended = "Unfortunately your monthly payment has been missed and we have placed " +
"your account on a temporary hold. Please login to your Paypal account to remedy the issue. " +
"You can go directly to PayPal by clicking the link below. Once your account is current, you can " +
"log back in where we will have everything saved just how you left it.";

module.exports = {
  threeDayNotice: threeDayNotice,
  trialEnds: trialEnds,
  accountSuspended: accountSuspended
};
