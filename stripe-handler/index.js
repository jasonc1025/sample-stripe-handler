// [jwc] 
// *** IMPORTANT: Though the 'sample-stripe-handler' repo has been attached to MS-Azure:VueJs-ShopStripe-SandrasD,
// * unfortunately,  'MS-Azure:stripe-handler:index.js' fails to be connected to ('Error 401 Unauthorization').
// * Yet, index.js from 'MS-Azure:HttpTriggerJS1:index.js' succeeds.  
// * Maybe because only the first Function as a Service (FAAS) is active?
// *** Yet, the 'sample-stripe-handler' repo provides the 'node_modules' needed for 'MS-Azure:HttpTriggerJS1:index.js' to work finally. AHG.
// 


// [jwc]>> Following Archived from 'MsAzure:VueJs-ShopStripe-SandrasD'
//

// <script src="https://js.stripe.com/v3/"></script>

// [jwc]+1 orig: var stripe = require('stripe')('sk_test_js5LRkmS7OsYHtVc7XYvK9OB');
// [jwc]Y AHG Fixed after included repo from GitHub: var stripe = require('stripe')('sk_test_NhYGHM4AS0f4qmPaxknfR9fU');

//[jwc]+x Test Sample works:
// {
//     stripeEmail: "jasonc@eande.world"  // email can/should be anything
//     stripeToken: "tok_visa"
//     stripeAmt: "50.00"
// }

//
// [jwc]<< Following Archived from 'MsAzure:VueJs-ShopStripe-SandrasD'


// [jwc]+1 orig: var stripe = require('stripe')('sk_test_js5LRkmS7OsYHtVc7XYvK9OB');
var stripe = require('stripe')('sk_test_NhYGHM4AS0f4qmPaxknfR9fU');
// ^ this is a stripe testing key

module.exports = function(context, req) {
  context.log('starting to get down');

  //if we have a request body, an email, and a token, let's get started
  if (
    req.body &&
    req.body.stripeEmail &&
    req.body.stripeToken &&
    req.body.stripeAmt
  ) {
    stripe.customers
      .create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
      })
      .then(customer => {
        context.log('starting the stripe charges');
        stripe.charges.create({
          amount: req.body.stripeAmt,
          description: 'Sample Charge',
          currency: 'usd',
          customer: customer.id
        });
      })
      .then(charge => {
        context.log('finished the stripe charges');
        context.res = {
          // status: 200
          body: 'This has been completed'
        };
        context.done();
      })
      .catch(err => {
        context.log(err);
        context.done();
      });
  } else {
    context.log(req.body);
    context.res = {
      status: 400,
      body: "We're missing something"
    };
    context.done();
  }
};
