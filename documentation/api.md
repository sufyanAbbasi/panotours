## Functions

<dl>
<dt><a href="#init">init(none)</a> ⇒</dt>
<dd><p>Init function, called after body load.</p>
</dd>
<dt><a href="#resizeToWindow">resizeToWindow(none)</a> ⇒</dt>
<dd><p>Edits css of certain elements based on the current window width</p>
</dd>
<dt><a href="#searchAttributes">searchAttributes(none)</a> ⇒</dt>
<dd><p>Searches Solr Gothic namespace based on the current value in the search bar</p>
</dd>
<dt><a href="#processSolrJSON">processSolrJSON(search, handler)</a> ⇒</dt>
<dd><p>Calls Solr Engine for search return JSON and passes JSON into the callback handler</p>
</dd>
<dt><a href="#processAllPanos">processAllPanos(panoList)</a> ⇒ <code>number</code></dt>
<dd><p>Callback Handler for processing JSON containing all found panoramas currently in database</p>
</dd>
<dt><a href="#processAllCathedrals">processAllCathedrals(cathedralList)</a> ⇒ <code>number</code></dt>
<dd><p>Callback Handler for processing JSON containing all found cathedrals currently in database</p>
</dd>
<dt><a href="#processPanoSearch">processPanoSearch(panoList)</a> ⇒ <code>number</code></dt>
<dd><p>Callback Handler for processing JSON containing found panoramas returned by the search</p>
</dd>
<dt><a href="#processCathedralSearch">processCathedralSearch(cathedralList)</a> ⇒ <code>number</code></dt>
<dd><p>Callback Handler for processing JSON containing found cathedrals returned by the search</p>
</dd>
<dt><a href="#clickPano">clickPano(input)</a></dt>
<dd><p>Opens up a panorama window when clicked on in search table</p>
</dd>
<dt><a href="#clickCathedral">clickCathedral(input)</a></dt>
<dd><p>Opens up a cathedral window when clicked on in search table</p>
</dd>
<dt><a href="#makePanoPost">makePanoPost(title, panoID)</a></dt>
<dd><p>Makes a panorama post and appends it to the document</p>
</dd>
<dt><a href="#makeCathedralPost">makeCathedralPost(title, panoID)</a></dt>
<dd><p>Makes a cathedral post and appends it to the document</p>
</dd>
<dt><a href="#isPost">isPost(the)</a> ⇒ <code>number</code></dt>
<dd><p>Checks if a post already exists</p>
</dd>
<dt><a href="#removePost">removePost(the)</a></dt>
<dd><p>Removes a post from the document</p>
</dd>
<dt><a href="#checkPostsDisplay">checkPostsDisplay(none)</a></dt>
<dd><p>Hides the #posts div if there are no posts in the posts area</p>
</dd>
<dt><a href="#tabSelect">tabSelect(element)</a></dt>
<dd><p>Determines which tab is currently selected in a post and gives that tab 
a class of selected</p>
</dd>
<dt><a href="#switchTabs">switchTabs(element)</a></dt>
<dd><p>switches tab to the tab with class selected</p>
</dd>
<dt><a href="#initializeSearchMap">initializeSearchMap(none)</a></dt>
<dd><p>Initializes the main search map</p>
</dd>
<dt><a href="#initializeCathedralMap">initializeCathedralMap(mapDiv)</a></dt>
<dd><p>Initializes map within each cathedral information post</p>
</dd>
<dt><a href="#resizeMaps">resizeMaps(mapDiv)</a></dt>
<dd><p>Resizes all the maps currently initialized in posts</p>
</dd>
</dl>

<a name="init"></a>

## init(none) ⇒
Init function, called after body load.

**Kind**: global function  
**Returns**: none  

| Param |
| --- |
| none | 

<a name="resizeToWindow"></a>

## resizeToWindow(none) ⇒
Edits css of certain elements based on the current window width

**Kind**: global function  
**Returns**: none  

| Param |
| --- |
| none | 

<a name="searchAttributes"></a>

## searchAttributes(none) ⇒
Searches Solr Gothic namespace based on the current value in the search bar

**Kind**: global function  
**Returns**: none  

| Param |
| --- |
| none | 

<a name="processSolrJSON"></a>

## processSolrJSON(search, handler) ⇒
Calls Solr Engine for search return JSON and passes JSON into the callback handler

**Kind**: global function  
**Returns**: none  

| Param | Type | Description |
| --- | --- | --- |
| search | <code>string</code> | The parameters to search SOLR with |
| handler | <code>functoin</code> | The callback function to process the JSON with |

<a name="processAllPanos"></a>

## processAllPanos(panoList) ⇒ <code>number</code>
Callback Handler for processing JSON containing all found panoramas currently in database

**Kind**: global function  
**Returns**: <code>number</code> - numFound number of elements found in search  

| Param | Type | Description |
| --- | --- | --- |
| panoList | <code>array</code> | List of all panoramas currently in database |

<a name="processAllCathedrals"></a>

## processAllCathedrals(cathedralList) ⇒ <code>number</code>
Callback Handler for processing JSON containing all found cathedrals currently in database

**Kind**: global function  
**Returns**: <code>number</code> - numFound number of elements found in search  

| Param | Type | Description |
| --- | --- | --- |
| cathedralList | <code>array</code> | List of all cathedrals currently in database |

<a name="processPanoSearch"></a>

## processPanoSearch(panoList) ⇒ <code>number</code>
Callback Handler for processing JSON containing found panoramas returned by the search

**Kind**: global function  
**Returns**: <code>number</code> - numFound number of elements found in search  

| Param | Type | Description |
| --- | --- | --- |
| panoList | <code>array</code> | List of panoramas found by search in database |

<a name="processCathedralSearch"></a>

## processCathedralSearch(cathedralList) ⇒ <code>number</code>
Callback Handler for processing JSON containing found cathedrals returned by the search

**Kind**: global function  
**Returns**: <code>number</code> - numFound number of elements found in search  

| Param | Type | Description |
| --- | --- | --- |
| cathedralList | <code>array</code> | List of cathedrals found by search in database |

<a name="clickPano"></a>

## clickPano(input)
Opens up a panorama window when clicked on in search table

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>input</code> &#124; <code>element</code> | Input element clicked on |

<a name="clickCathedral"></a>

## clickCathedral(input)
Opens up a cathedral window when clicked on in search table

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>input</code> &#124; <code>element</code> | Input element clicked on |

<a name="makePanoPost"></a>

## makePanoPost(title, panoID)
Makes a panorama post and appends it to the document

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>string</code> | The title of the panorama |
| panoID | <code>string</code> | The pano ID of the panorama |

<a name="makeCathedralPost"></a>

## makeCathedralPost(title, panoID)
Makes a cathedral post and appends it to the document

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>string</code> | The title of the cathedral |
| panoID | <code>string</code> | The pano ID of the cathedral |

<a name="isPost"></a>

## isPost(the) ⇒ <code>number</code>
Checks if a post already exists

**Kind**: global function  
**Returns**: <code>number</code> - index in posts array or -1 if does not exist  

| Param | Type | Description |
| --- | --- | --- |
| the | <code>string</code> | pano ID of the post |

<a name="removePost"></a>

## removePost(the)
Removes a post from the document

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| the | <code>string</code> | pano ID of the post |

<a name="checkPostsDisplay"></a>

## checkPostsDisplay(none)
Hides the #posts div if there are no posts in the posts area

**Kind**: global function  

| Param |
| --- |
| none | 

<a name="tabSelect"></a>

## tabSelect(element)
Determines which tab is currently selected in a post and gives that tab 
a class of selected

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>div</code> | The div tab element |

<a name="switchTabs"></a>

## switchTabs(element)
switches tab to the tab with class selected

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>div</code> | The div tab element |

<a name="initializeSearchMap"></a>

## initializeSearchMap(none)
Initializes the main search map

**Kind**: global function  

| Param |
| --- |
| none | 

<a name="initializeCathedralMap"></a>

## initializeCathedralMap(mapDiv)
Initializes map within each cathedral information post

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| mapDiv | <code>dic</code> | The div for containing the map |

<a name="resizeMaps"></a>

## resizeMaps(mapDiv)
Resizes all the maps currently initialized in posts

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| mapDiv | <code>dic</code> | The div for containing the map |

