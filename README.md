# PredictionIO Analytics

This is library to notify to PredictionIO user action.

User are identified by UUID that is store in cookie and accessible in ```__poia_1``` cookie

On user creation a UUID is send to a specified entry point using:

    POST /entry_point.php?user_create=true&amp;user=9195308e-5a2c-402d-883f-c707f95e64ef

page tracking is generate using:

    // Create POIA
    var p = new PIOA('entry_point.php');

    // Initialize
    p.init();

    // track page view
    p.track({
      id: 12,
      type: 'article',
      action: 'view'
    });

This create a GET request:

    POST /pioa.php?id=12&amp;type=article&amp;action=view&amp;user=9195308e-5a2c-402d-883f-c707f95e64ef

in demo.js there is a usage sample.
