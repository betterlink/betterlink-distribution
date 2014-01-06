Betterlink Distribution Scripts
==============
Distribution scripts for `betterlink.js`. Additions are welcome.

Current offerings:
- Chrome Extension
- Bookmarklet

These types of distributions allow you to enable Betterlink on any website you visit. The clear benefit is that you can save and share links wherever you want. However, visitors to your links will only see the magic if they've also enabled their own browser extension.

If you are interested in creating a new distribution, please consider updating the `data-script-source` attribute (as exampled in the source of current options). This will help us understand the use of Betterlink before individual sites enable this feature for everybody.


<h2>Chrome Extension <small>(to install locally)</small></h2>

2. Within chrome, go to `chrome://extensions`
3. Select 'Developer mode' checkbox
4. Select 'Load unpacked extension...'
5. Choose directory at `betterlink-distribution/chrome-extension/`
6. Celebrate, because every webpage is now enabled for super-sharing
  - Changes to the Chrome Extension can be refreshed by going back to `chrome://extensions` and hitting 'reload'

License
---------

This library is distributed under the Apache 2.0 License found in the [LICENSE](https://github.com/betterlink/betterlink-distribution/blob/master/LICENSE.txt) file.