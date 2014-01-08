/*
Copyright (c) 2010, Geomatics and Cartographic Research Centre, Carleton 
University
All rights reserved.

Redistribution and use in source and binary forms, with or without 
modification, are permitted provided that the following conditions are met:

 - Redistributions of source code must retain the above copyright notice, 
   this list of conditions and the following disclaimer.
 - Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.
 - Neither the name of the Geomatics and Cartographic Research Centre, 
   Carleton University nor the names of its contributors may be used to 
   endorse or promote products derived from this software without specific 
   prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE 
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE 
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE 
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR 
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF 
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS 
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
POSSIBILITY OF SUCH DAMAGE.

$Id: n2.couchEdit.js 8458 2012-08-29 13:12:06Z jpfiset $
*/

;(function($,$n2) {

// Localization
var _loc = function(str,args){ return $n2.loc(str,'nunaliit2-couch',args); };
var DH = 'n2.couchEdit';

function getDefaultCouchProjection(){
	var defaultCouchProj = null;
	if( typeof(OpenLayers) !== 'undefined' 
	 && OpenLayers.Projection ) {
		defaultCouchProj = new OpenLayers.Projection('EPSG:4326');
	};
	return defaultCouchProj;
};

//++++++++++++++++++++++++++++++++++++++++++++++


function isKeyEditingAllowed(obj, selectors, data) {
	
	if( !selectors ) return false;
	
	if( selectors[0] === '_id' ) return false;
	if( selectors[0] === '_rev' ) return false;
	
	return true;
}

function isValueEditingAllowed(obj, selectors, data) {
	
	if( !selectors ) return false;

	if( selectors[0] === '_id' ) return false;
	if( selectors[0] === '_rev' ) return false;
	
	return true;
};

function isKeyDeletionAllowed(obj, selectors, data) {
	
	if( !selectors ) return false;

	if( selectors[0] === '_id' ) return false;
	if( selectors[0] === '_rev' ) return false;
	
	return true;
};

function searchForDocumentId(options_){

	var options = $n2.extend({
		searchServer: null
		,showService: null
		,onSelected: function(docId){}
		,onReset: function(){}
	},options_);
	
	var shouldReset = true;
	
	var dialogId = $n2.getUniqueId();
	var inputId = $n2.getUniqueId();
	var searchButtonId = $n2.getUniqueId();
	var displayId = $n2.getUniqueId();
	var $dialog = $('<div id="'+dialogId+'" class="editorSelectDocumentDialog">'
			+'<div><label for="'+inputId+'">'+_loc('Search:')+'</label>'
			+'<input id="'+inputId+'" type="text"/>'
			+'<button id="'+searchButtonId+'">'+_loc('Search')+'</button></div>'
			+'<div  class="editorSelectDocumentDialogResults" id="'+displayId+'"></div>'
			+'<div><button class="cancel">'+_loc('Cancel')+'</button></div>'
			+'</div>');
	
	$dialog.find('button.cancel')
			.button({icons:{primary:'ui-icon-cancel'}})
			.click(function(){
				var $dialog = $('#'+dialogId);
				$dialog.dialog('close');
				return false;
			})
		;
	
	var dialogOptions = {
		autoOpen: true
		,title: _loc('Select Document')
		,modal: true
		,width: 370
		,close: function(event, ui){
			var diag = $(event.target);
			diag.dialog('destroy');
			diag.remove();
			if( shouldReset ) {
				options.onReset();
			};
		}
	};
	$dialog.dialog(dialogOptions);

	options.searchServer.installSearch({
		textInput: $('#'+inputId)
		,searchButton: $('#'+searchButtonId)
		,displayFn: displaySearch
		,onlyFinalResults: true
	});
	
	function displaySearch(displayData) {
		if( !displayData ) {
			reportError('Invalid search results returned');

		} else if( 'wait' === displayData.type ) {
			$('#'+displayId).empty();

		} else if( 'results' === displayData.type ) {
			var $table = $('<table></table>');
			$('#'+displayId).empty().append($table);
		
			for(var i=0,e=displayData.list.length; i<e; ++i) {
				var docId = displayData.list[i].id;
				var $tr = $('<tr></tr>');

				$table.append($tr);
				
				$td = $('<td class="olkitSearchMod2_'+(i%2)+'">'
					+'<a href="#'+docId+'" alt="'+docId+'"></a></td>');
				$tr.append($td);
				if( options.showService ) {
					options.showService.printBriefDescription($td.find('a'),docId);
				} else {
					$td.find('a').text(docId);
				};
				$td.find('a').click( createClickHandler(docId) );
			};
			
		} else {
			reportError('Invalid search results returned');
		};
	};
	
	function createClickHandler(docId) {
		return function(e){
			options.onSelected(docId);
			shouldReset = false;
			var $dialog = $('#'+dialogId);
			$dialog.dialog('close');
			return false;
		};
	};
};

function selectLayersDialog(opts_){
	
	var opts = $n2.extend({
		currentLayers: []
		,cb: function(selectedLayerIds){}
		,resetFn: function(){}
		,designDoc: null
		,showService: null
		,dispatchService: null
	},opts_);
	
	var layers = {};
	if( typeof(opts.currentLayers) === 'string' ){
		var layerNames = currentLayers.split(',');
		for(var i=0,e=layerNames.length;i<e;++i){
			layers[ $n2.trim(layerNames[i]) ] = true;
		};
		
	} else if( $n2.isArray(opts.currentLayers) ){
		for(var i=0,e=opts.currentLayers.length;i<e;++i){
			layers[ $n2.trim(opts.currentLayers[i]) ] = true;
		};
	};

	var shouldReset = true;
	var dialogId = $n2.getUniqueId();
	var $dialog = $('<div id="'+dialogId+'" class="editorSelectLayerDialog">'
			+'<div class="editorSelectLayerContent"></div>'
			+'<div class="editorSelectLayerButtons"><button class="ok">'+_loc('OK')+'</button>'
			+'<button class="cancel">'+_loc('Cancel')+'</button></div>'
			+'</div>');
	
	$dialog.find('button.cancel')
		.button({icons:{primary:'ui-icon-cancel'}})
		.click(function(){
			var $dialog = $('#'+dialogId);
			$dialog.dialog('close');
			return false;
		});
	$dialog.find('button.ok')
		.button({
			icons:{primary:'ui-icon-check'}
			,disabled: true
		});
	
	var dialogOptions = {
		autoOpen: true
		,title: _loc('Select Layers')
		,modal: true
		,width: 370
		,close: function(event, ui){
			var diag = $(event.target);
			diag.dialog('destroy');
			diag.remove();
			if( shouldReset ) {
				opts.resetFn();
			};
		}
	};
	$dialog.dialog(dialogOptions);
	
	// Get layers
	if( opts.designDoc ){
		opts.designDoc.queryView({
			viewName: 'layer-definitions'
			,onlyRows: true
			,onSuccess: function(rows){
				var layerIdentifiers = {};
				for(var i=0,e=rows.length;i<e;++i){
					layerIdentifiers[rows[i].key] = true;
				};
				getInnerLayers(layerIdentifiers);
			}
			,onError: function(errorMsg){ 
				reportError(errorMsg);
			}
		});
	};
	
	function getInnerLayers(layerIdentifiers){
		var m = {
			type: 'mapGetLayers'
			,layers: {}
		};
		opts.dispatchService.synchronousCall(DH, m);
		for(var layerId in m.layers){
			layerIdentifiers[layerId] = true;
		};
		displayLayers(layerIdentifiers);
	};
	
	function displayLayers(layerIdentifiers){
		var $diag = $('#'+dialogId);
		
		var $c = $diag.find('.editorSelectLayerContent');
		$c.empty();
		for(var layer in layerIdentifiers){
			var inputId = $n2.getUniqueId();
			var $div = $('<div><input id="'+inputId+'" class="layer" type="checkbox"/><label for="'+inputId+'"></label></div>');
			$c.append($div);
			$div.find('input').attr('name',layer);
			$div.find('label').text(layer);
			if( layers[layer] ){
				$div.find('input').attr('checked','checked');
			};
			
			if(opts.showService){
				opts.showService.printLayerName($div.find('label'), layer);
			};
		};
		
		$diag.find('button.ok')
			.button('option','disabled',false)
			.click(function(){
				var selectedLayers = [];
				var $diag = $('#'+dialogId);
				$diag.find('input.layer').each(function(){
					var $input = $(this);
					if( $input.is(':checked') ){
						var layer = $input.attr('name');
						selectedLayers.push(layer);
					};
				});
				opts.cb(selectedLayers);

				shouldReset = false;
				$diag.dialog('close');
			});
	};
	
	function reportError(err){
		$('#'+dialogId).find('.editorSelectLayerContent').text('Error: '+err);
	};
};


//++++++++++++++++++++++++++++++++++++++++++++++

var CouchDocumentEditor = $n2.Class({
	
	options: null
	
	,treeEditor: null
	
	,slideEditor: null

	,editedDocument: null
	
	,editedFeature: null
	
	,currentGeometryWkt: null
	
	,editorContainerId: null
	
	,isInsert: null
	
	,userButtons: null
	
	,initialize: function(
		parentOptions_
		,ownOptions_
		) {
		
		this.options = $n2.extend({
			panelName: null
			,initialLayers: ['public']
			,selectAudioFn: function(feature_,cbFn){ alert('Feature not supported'); }
			,onFeatureInsertedFn: function(fid,feature){}
			,onFeatureUpdatedFn: function(fid,feature){}
			,onFeatureDeletedFn: function(fid,feature){}
			,onCancelFn: function(feature){}
			,onCloseFn: function(){}
			,enableAddFile: false
		}, parentOptions_, ownOptions_);
		
		this.userButtons = [];
		var label = 'button';
		for(var key in this.options) {
			if( key.substr(0,label.length) === label ) {
				this.userButtons.push(this.options[key]);
			};
		};
	}

	,_getUploadService: function(){
		if( this.options.serviceDirectory 
		 && this.options.serviceDirectory.uploadService ) {
			return this.options.serviceDirectory.uploadService;
		};
		
		return null;
	}

	,_getSearchService: function(){
		if( this.options.serviceDirectory 
		 && this.options.serviceDirectory.searchService ) {
			return this.options.serviceDirectory.searchService;
		};
		
		return null;
	}

	,_getShowService: function(){
		if( this.options.serviceDirectory 
		 && this.options.serviceDirectory.showService ) {
			return this.options.serviceDirectory.showService;
		};
		
		return null;
	}

	,_getSchemaEditorService: function(){
		if( this.options.serviceDirectory 
		 && this.options.serviceDirectory.schemaEditorService ) {
			return this.options.serviceDirectory.schemaEditorService;
		};
		
		return null;
	}

	,_getSchemaRepository: function(){
		if( this.options.serviceDirectory 
		 && this.options.serviceDirectory.schemaRepository ) {
			return this.options.serviceDirectory.schemaRepository;
		};
		
		return null;
	}

	,startFeatureEditing: function(
		feature_
		) {
		
		var _this = this;
	
		this.editedFeature = feature_;
		this.editedDocument = feature_.data;
	
		this.currentGeometryWkt = null;
		if( this.editedDocument 
		 && this.editedDocument[this.options.geomName] ) {
			this.currentGeometryWkt = this.editedDocument[this.options.geomName].wkt;
		};
		
		this.isInsert = (typeof(this.editedFeature.fid) === 'undefined' || this.editedFeature.fid === null);
		
		if( this.isInsert ) {
			// must do initial object work
	    	var geom = this.convertFeatureGeometryForDb(this.editedFeature);
	    	var g = $n2.couchGeom.getCouchGeometry(geom);
	    	this.editedDocument[this.options.geomName] = g;
			
			// Add default layers?
	    	if( this.options.initialLayers 
	    	 && this.options.initialLayers.length > 0 ) {
	    		this.editedDocument.nunaliit_layers = this.options.initialLayers;
	    	};
		};

		this._selectSchema(schemaSelected);
		
		function schemaSelected(schema) {
			if( _this.isInsert ) {
				// Create original object by augmenting current one with template
				if( schema ) {
					var template = schema.createObject({});
					$n2.extend(true, _this.editedDocument, template);
				};

				// must do initial object work
		    	var geom = _this.convertFeatureGeometryForDb(_this.editedFeature);
		    	var g = $n2.couchGeom.getCouchGeometry(geom);
		    	_this.editedDocument[_this.options.geomName] = g;
				
				// Add default layers?
		    	if( _this.options.initialLayers 
		    	 && _this.options.initialLayers.length > 0 ) {
		    		_this.editedDocument.nunaliit_layers = _this.options.initialLayers;
		    	};
			};
			
			_this._displayEditor(schema);
		};
	}

	,startDocumentEditing: function(
		doc_
		) {

		var _this = this;
		
		this.editedDocument = doc_;
	
		this.isInsert = (typeof(this.editedDocument._id) === 'undefined' || this.editedDocument._id === null);
	
		this._selectSchema(schemaSelected);
		
		function schemaSelected(schema) {
			if( _this.isInsert ) {
				// Create original object by augmenting current one with template
				if( schema ) {
					var template = schema.createObject({});
					$n2.extend(true, _this.editedDocument, template);
				};
			};
			
			_this._displayEditor(schema);
		};
	}
	
	,_selectSchema: function(callbackFn) {
		var _this = this;

		// Check hint from document
		if( this.editedDocument.nunaliit_schema ) {
			this._getSchemaRepository().getSchema({
				name: this.editedDocument.nunaliit_schema
				,onSuccess: function(schema){
					callbackFn(schema);
				}
				,onError: function(err){
					$n2.log('Error fetching schema: '+_this.editedDocument.nunaliit_schema,err);
					callbackFn(null);
				}
			});
			
		} else if( this.options.schema && this.isInsert ) {
			if( $n2.CouchEditor.Constants.ALL_SCHEMAS === this.options.schema ) {
				// Must select a schema from all root schemas
				this._getSchemaRepository().getRootSchemas({
					onSuccess: function(schemas){
						selectFromSchemas(schemas);
					}
					,onError: function(err){
						$n2.log('Error fetching root schemas',err);
						callbackFn(null);
					}
				});
				
			} else if( $n2.isArray(this.options.schema) ) {
				// Must select a schema
				selectFromSchemas(this.options.schema);
				
			} else {
				// Only one schema to select from
				callbackFn(this.options.schema);
			};
			
		} else if( this.options.defaultEditSchema && !this.isInsert ) {
			// If the object does not specify a schema, use default schema
			// if specified
			callbackFn(this.options.defaultEditSchema);
			
		} else {
			// No schema specified, go directly to displaying editor
			callbackFn(null);
		};
		
		function selectFromSchemas(schemas) {
			// shortcuts
			if( schemas.length < 1 ) {
				callbackFn(null);
				return;
				
			} else if( schemas.length == 1 ) {
				callbackFn(schemas[0]);
				return;
			};
			
			var dialogId = $n2.getUniqueId();
			var selectId = $n2.getUniqueId();
			var $dialog = $('<div id="'+dialogId+'" class="editorSelectSchemaDialog">'
					+'<label for="'+selectId+'">'+_loc('Select a schema:')+'</label>'
					+'<select id="'+selectId+'"></select>'
					+'<div><button>'+_loc('OK')+'</button><button>'+_loc('Cancel')+'</button></div>'
					+'</div>');
			
			var $select = $dialog.find('select');
			for(var i=0,e=schemas.length; i<e; ++i) {
				$select.append( $('<option>'+schemas[i].name+'</option>') );
			}
			
			var cancelOnClose = true;
			
			$dialog.find('button')
				.first()
					.button({icons:{primary:'ui-icon-check'}})
					.click(function(){
						var $dialog = $('#'+dialogId);
						var $select = $dialog.find('select');
						var schemaName = $select.val();

						$n2.log('schemaName',schemaName);
						_this._getSchemaRepository().getSchema({
							name: schemaName
							,onSuccess: function(schema){
								callbackFn(schema);
							}
							,onError: function(err){
								reportError('Unable to get selected schema: '+err);
								_this._cancelEdit();
							}
						});
				
						cancelOnClose = false;
						$dialog.dialog('close');
						return false;
					})
				.next()
					.button({icons:{primary:'ui-icon-cancel'}})
					.click(function(){
						var $dialog = $('#'+dialogId);
						$dialog.dialog('close');
						return false;
					})
				;
			
			var dialogOptions = {
				autoOpen: true
				,title: _loc('Select Document Schema')
				,modal: true
				,close: function(event, ui){
					var diag = $(event.target);
					diag.dialog('destroy');
					diag.remove();
					
					if( cancelOnClose ){
						_this._cancelEdit();
					};
				}
			};
			$dialog.dialog(dialogOptions);
		};
	}
    
    ,_displayEditor: function(selectedSchema) {
    	var _this = this;
    	
    	var data = this.editedDocument;
		
		// Update feature data with user info
		if( $n2.couchMap && $n2.couchMap.adjustDocument ) {
			$n2.couchMap.adjustDocument(data);
		};
    	
		var attributeDialog = $('#'+this.options.panelName);
		attributeDialog.empty();
		
		this.editorContainerId = $n2.getUniqueId();
		var $editorContainer = $('<div id="'+this.editorContainerId+'" class="n2CouchEditor_container"></div>');
		attributeDialog.append($editorContainer);

		var schemaEditorService = this._getSchemaEditorService();
		if( selectedSchema && schemaEditorService ) {
			$n2.schema.GlobalAttributes.disableKeyUpEvents = true;
			
			var $schemaHeader = $('<h3><a href="#">'+_loc('Form View')+'</a></h3>');
			var $schemaContainer = $('<div class="n2CouchEditor_schema"></div>');
			$editorContainer.append($schemaHeader).append($schemaContainer);
			
			this.schemaEditor = schemaEditorService.editDocument({
				doc: data
				,schema: selectedSchema
				,$div: $schemaContainer
				,onChanged: function(){
					_this._adjustInternalValues(_this.editedDocument);
					if( _this.treeEditor ) {
						_this.treeEditor.refresh();
					};
					if( _this.slideEditor ) {
						_this.slideEditor.refresh();
					};
					_this._refreshRelations(data);
					_this.onEditorObjectChanged(data);
				}
			});
		};

		var $treeHeader = $('<h3><a href="#">'+_loc('Tree View')+'</a></h3>');
		var $treeContainer = $('<div class="n2CouchEditor_tree"></div>');
		$editorContainer.append($treeHeader).append($treeContainer);
		var editorOptions = {
			onObjectChanged: function() {
				_this._adjustInternalValues(_this.editedDocument);
				if( _this.slideEditor ) {
					_this.slideEditor.refresh();
				};
				if( _this.schemaEditor ) {
					_this.schemaEditor.refresh();
				};
				_this._refreshRelations(data);
				_this.onEditorObjectChanged(data);
			}
			,isKeyEditingAllowed: isKeyEditingAllowed
			,isValueEditingAllowed: isValueEditingAllowed
			,isKeyDeletionAllowed: isKeyDeletionAllowed
		};
		var objectTree = new $n2.tree.ObjectTree($treeContainer, data, editorOptions);
		this.treeEditor = new $n2.tree.ObjectTreeEditor(objectTree, data, editorOptions);
		
		var $slideHeader = $('<h3><a href="#">'+_loc('Editor View')+'</a></h3>');
		var $slideContainer = $('<div class="n2CouchEditor_slide"></div>');
		$editorContainer.append($slideHeader).append($slideContainer);
		var slideEditorOptions = {
			onObjectChanged: function() {
				_this._adjustInternalValues(_this.editedDocument);
				if( _this.treeEditor ) {
					_this.treeEditor.refresh();
				};
				if( _this.schemaEditor ) {
					_this.schemaEditor.refresh();
				};
				_this._refreshRelations(data);
				_this.onEditorObjectChanged(data);
			}
			,isKeyEditingAllowed: isKeyEditingAllowed
			,isValueEditingAllowed: isValueEditingAllowed
			,isKeyDeletionAllowed: isKeyDeletionAllowed
		};
		this.slideEditor = new $n2.slideEditor.Editor($slideContainer, data, slideEditorOptions);
		
		$editorContainer.accordion({ collapsible: true });
		
		// Report relations
		var $displayRelationsDiv = $('<div class="editorDisplayRelations"></div>');
		$editorContainer.append( $displayRelationsDiv );
		this._refreshRelations(data);

		// Remove attachments
		if( this.options.enableAddFile ){
			// Compute attachments
			var hasAttachments = false;
			var attachments = {};
			if( data 
			 && data.nunaliit_attachments 
			 && data.nunaliit_attachments.files ){
				for(var attName in data.nunaliit_attachments.files){
					var att = data.nunaliit_attachments.files[attName];
					if( !att.source ) { // do not include thumbnails and originals
						attachments[attName] = true;
						hasAttachments = true;
					};
				};
			};
			
			if( hasAttachments ) {
				var $removeAttachmentsDiv = $('<div class="editorRemoveAttachments"></div>');
				$editorContainer.append( $removeAttachmentsDiv );
				
				// Function to delete an attachment
				var removeAttFn = function(e){
					var $btn = $(this);
					var $removeAttDiv = $btn.parents('.editorRemoveAttachment');
					if( $removeAttDiv.length > 0 ){
						var attName = $removeAttDiv.attr('nunaliitAttName');
						_this._removeAttachment(attName);
						$removeAttDiv.remove();
					};
					
					return false;
				};
				
				for(var attName in attachments){
					var $removeAttDiv = $('<div class="editorRemoveAttachment"></div>');
					$removeAttachmentsDiv.append($removeAttDiv);
					$removeAttDiv.attr('nunaliitAttName',attName);

					$('<span></span>')
						.text( _loc('Attachment: ') + attName )
						.appendTo($removeAttDiv);
					
					$('<button class="editorRemoveAttachmentButton"></button>')
						.text( _loc('Remove') )
						.appendTo($removeAttDiv)
						.button({icons:{primary:'ui-icon-trash'}})
						.click(removeAttFn)
						;
				};
			};
		};

		if( null != this._getUploadService() ){
			$editorContainer.append( $('<div class="editorAttachFile"></div>') );
		};

		var formButtons = $('<div class="editorButtons"></div>');
		$editorContainer.append(formButtons);

		var saveBtn = $('<button class="save">'+_loc('Save')+'</button>');
		formButtons.append(saveBtn);
		saveBtn.button({icons:{primary:'ui-icon-check'}});
		saveBtn.click(save);

		if( !this.isInsert
		 && $n2.couchMap.canDeleteDoc(data)
			) {
			var deleteBtn = $('<button class="delete">'+_loc('Delete')+'</button>');
			formButtons.append(deleteBtn);
			deleteBtn.button({icons:{primary:'ui-icon-trash'}});
			deleteBtn.click(function(evt){
		  		if( confirm( _loc('Do you really want to delete this feature?') ) ) {
    				deletion(data);
		  		};
		  		return false;
			});
		};

		if( this.options.enableAddFile 
		 && null != this._getUploadService() ){
			var attachBtn = $('<button class="file">'+_loc('Add File')+'</button>');
			formButtons.append(attachBtn);
			attachBtn.button({icons:{primary:'ui-icon-plusthick'}});
			attachBtn.click(function(){ _this._addFile(); return false; });
		};

		var addRelationBtn = $('<button class="relation">'+_loc('Add Relation')+'</button>');
		formButtons.append(addRelationBtn);
		addRelationBtn.button({icons:{primary:'ui-icon-plusthick'}});
		addRelationBtn.click(function(){ _this._addRelationDialog(); return false; });

		var layersBtn = $('<button class="layers">'+_loc('Layers')+'</button>');
		formButtons.append(layersBtn);
		layersBtn.button({icons:{primary:'ui-icon-link'}});
		layersBtn.click(function(){ _this._manageLayersDialog(); return false; });

		var cancelBtn = $('<button class="cancel">'+_loc('Cancel')+'</button>');
		formButtons.append(cancelBtn);
		cancelBtn.button({icons:{primary:'ui-icon-cancel'}});
		cancelBtn.click(function(){ 
			_this._cancelEdit();
			return false;
		});
		
		// Add user buttons
		for(var i=0,e=this.userButtons.length; i<e; ++i) {
			var userButton = this.userButtons[i];
			
			var $uBtn = $('<button>'+_loc(''+userButton.label)+'</button>');
			if( userButton.buttonClass ) {
				$uBtn.addClass(userButton.buttonClass);
			};
			if( userButton.before ) {
				var $anchor = formButtons.find('button.'+userButton.before);
				$anchor.before($uBtn);
			} else if( userButton.after ) {
				var $anchor = formButtons.find('button.'+userButton.after);
				$anchor.after($uBtn);
			} else {
				formButtons.append($uBtn);
			};
			$uBtn.button(userButton.options);
			installUserButtonClick($uBtn, userButton);
		};
		
		function save() {
			// Verify that upload server is available
			if( null != _this._getUploadService() ){
				var uploadForms = [];
	    		var $editorContainer = $('#'+_this.editorContainerId);
	    		$editorContainer.find('.editorAddFileForm').each(function(i,elem){
	    			uploadForms.push(elem);
	    		});
	    		
	    		// Disable use of editor during uploading
	    		_this._disableControls();
				
				// Verify that server is available
	    		_this._getUploadService().getWelcome({
					onSuccess: function(){ save2(uploadForms); }
					,onError: function(err) {
			    		_this._enableControls();
						$n2.reportErrorForced('Server is not available: '+err);
					}
				});
			} else {
				save2([]);
			};
			return false;
		};
			
		function save2(uploadForms) {
			// Create or update document
			if( _this.isInsert ) {
				// This is an insert
				_this.options.db.createDocument({
					data: _this.editedDocument
					,onSuccess: function(docInfo) {
						_this.editedDocument._id = docInfo.id;
						_this.editedDocument._rev = docInfo.rev;
						save3(uploadForms, _this.editedDocument, true);
					}
					,onError: function(err){
			    		_this._enableControls();
						$n2.reportErrorForced('Unable to submit document: '+err);
					}
				});
			} else {
				// This is an update
				_this.options.db.updateDocument({
					data: _this.editedDocument
					,onSuccess: function(docInfo) {
						_this.editedDocument._rev = docInfo.rev;
						save3(uploadForms, _this.editedDocument, false);
					}
					,onError: function(err){
			    		_this._enableControls();
						$n2.reportErrorForced('Unable to submit document: '+err);
					}
				});
			};
		};
		
		function save3(uploadForms, editedDocument, inserted) {
			if( null == uploadForms || uploadForms.length < 1 ) {
				save4(editedDocument, inserted);
			} else {
				var $form = $( uploadForms.pop() );
				$form.prepend( $('<input type="hidden" name="id" value="'+editedDocument._id+'"/>') );
				$form.prepend( $('<input type="hidden" name="rev" value="'+editedDocument._rev+'"/>') );
				_this._getUploadService().submitForm({
					form: $form
					,onSuccess: function(){
						// Next one
						save3(uploadForms, editedDocument, inserted);
					}
					,onError: function(err) {
			    		_this._enableControls();
						$n2.reportErrorForced('Error uploading file: '+err);
					}
				});
			};
    	};
		
		function save4(editedDocument, inserted) {
			// Report that save is complete
			var discardOpts = {
				saved: true
			};
			if( inserted ) {
				_this.options.onFeatureInsertedFn(editedDocument._id,_this.editedFeature);
				discardOpts.inserted = true;
			} else {
				_this.options.onFeatureUpdatedFn(editedDocument._id,_this.editedFeature);
				discardOpts.updated = true;
			};
			_this._discardEditor(discardOpts);
    	};
    	
    	function deletion(editedDocument) {
			_this.options.db.deleteDocument({
				data: _this.editedDocument
				,onSuccess: function() {
					_this.options.onFeatureDeletedFn(editedDocument._id,_this.editedFeature);
					_this._discardEditor({deleted:true});
					_this._dispatch({
						type: 'documentDeleted'
						,docId: editedDocument._id
					});
				}
				,onError: function(err){
		    		_this._enableControls();
					$n2.reportErrorForced('Unable to delete document: '+err);
				}
			});
    	};
    	
		function installUserButtonClick($uBtn, userButton){
			$uBtn.click(function(){
				if( userButton.click ){
					return userButton.click(_this.editedDocument, _this, userButton);
				};
				return false;
			});
		};
	}
	
	,_addRelationDialog: function() {
		var _this = this;

		searchForDocumentId({
			searchServer: this._getSearchService()
			,showService: this._getShowService()
			,onSelected: function(docId){
				_this._addRelation(docId);
			}
		});
	}
    
    ,_addRelation: function(relDocId){
    	var data = this.editedDocument;

    	if( data 
    	 && data.nunaliit_source 
    	 && data.nunaliit_source.doc === relDocId ){
    		return;
    	};

    	if( data 
    	 && data.nunaliit_relations 
    	 && data.nunaliit_relations.length ){
    		for(var i=0,e=data.nunaliit_relations.length; i<e; ++i){
    			var rel = data.nunaliit_relations[i];
    			if( rel.doc === relDocId ){
    				return;
    			};
    		};
    	};
    	
    	if( data ){
    		if( !data.nunaliit_relations ){
    			data.nunaliit_relations = [];
    		};
    		
    		data.nunaliit_relations.push({
    			nunaliit_type: 'reference'
    			,doc: relDocId
    		});
    		
    		this.refresh();
    	};
    }
    
    ,_removeRelation: function(relDocId){
    	var data = this.editedDocument;
    	var refreshRequired = false;
    	
    	if( data 
    	 && data.nunaliit_source 
    	 && data.nunaliit_source.doc === relDocId ){
    		delete data.nunaliit_source;
    		refreshRequired = true;
    	};

    	if( data 
    	 && data.nunaliit_relations 
    	 && data.nunaliit_relations.length ){
    		var relRemoved = false;
    		var newRels = [];
    		for(var i=0,e=data.nunaliit_relations.length; i<e; ++i){
    			var rel = data.nunaliit_relations[i];
    			if( rel.doc === relDocId ){
    				relRemoved = true;
    			} else {
    				newRels.push(rel);
    			};
    		};
    		
    		if( newRels.length < 1 ){
        		delete data.nunaliit_relations;
        		refreshRequired = true;
    		} else if( relRemoved ){
    			data.nunaliit_relations = newRels;
        		refreshRequired = true;
    		};
    	};
    	
    	if( refreshRequired ){
    		this.refresh();
    	};
    }
    
    ,_manageLayersDialog: function(){
    	var _this = this;
    	var data = this.editedDocument;
    	var layers = data.nunaliit_layers;
    	if( !layers ){
    		layers = [];
    	};
    	selectLayersDialog({
    		currentLayers: layers
			,cb: function(selectedLayers){
	    		if( selectedLayers.length < 1 ){
	    			if( data.nunaliit_layers ){
	    				delete data.nunaliit_layers;
	    			};
	    		} else {
	    			data.nunaliit_layers = selectedLayers;
	    		};
	    		_this.refresh();
			}
			,designDoc: this.options.designDoc
			,showService: this._getShowService()
			,dispatchService: this._getDispatchService()
    	});
    }
    
    ,_removeAttachment: function(attNameToRemove){
    	var data = this.editedDocument;
    	
    	// Accumulate all the keys that must be removed
    	var keys = {};
    	if( data 
    	 && data.nunaliit_attachments 
    	 && data.nunaliit_attachments.files ){
    		for(var attName in data.nunaliit_attachments.files){
    			var att = data.nunaliit_attachments.files[attName];
    			if( attName === attNameToRemove ){
    				keys[attName] = true;
    			} else if( att.source === attNameToRemove ){
    				// Remove associated thumbnail and original
    				keys[attName] = true;
    			};
    		};
    	};
    	
    	// Delete necessary keys
    	var refreshRequired = false;
    	var attName = null;
    	for(attName in keys){
    		if( data._attachments && data._attachments[attName] ){
    			delete data._attachments[attName];
    			refreshRequired = true;
    		};
    		if( data.nunaliit_attachments.files[attName] ){
    			delete data.nunaliit_attachments.files[attName];
    			refreshRequired = true;
    		};
    	};
    	
    	// Remove _attachments if empty
    	if( data._attachments ){
    		var empty = true;
    		for(attName in data._attachments){
    			empty = false;
    		};
    		if( empty ){
    			delete data._attachments;
    			refreshRequired = true;
    		};
    	};
    	
    	// Remove nunaliit_attachments if empty
    	if( data.nunaliit_attachments ){
    		var empty = true;
    		if( data.nunaliit_attachments.files ) {
	    		for(attName in data.nunaliit_attachments.files){
	    			empty = false;
	    		};
    		};
    		if( empty ){
    			delete data.nunaliit_attachments;
    			refreshRequired = true;
    		};
    	};
    	
    	if( refreshRequired ){
    		this.refresh();
    	};
    }
    
    ,_cancelEdit: function(){
		this._dispatch({
			type: 'editCancel'
			,doc: this.editedDocument
		});
    }

	// Restores feature geometry before discarding the form
	,performCancellation: function(opts_) {
		var opts = $n2.extend({
			suppressEvents:false
		},opts_);
		if( null == this.editedDocument ) {
			return;
		};
	
		this.options.onCancelFn(this.editedFeature);

		this._discardEditor({
			cancelled:true
			,suppressEvents: opts.suppressEvents
		});
	}

	,_discardEditor: function(opts_) {
		var opts = $n2.extend({
			saved: false
			,inserted: false
			,updated: false
			,deleted: false
			,cancelled: false
			,suppressEvents: false
		},opts_);
		
		if( null == this.editedDocument ) {
			return;
		};

		var $editorContainer = this._getEditorContainer();
		$editorContainer.remove();

		this.options.onCloseFn(this.editedDocument, this);
		
		if( !opts.suppressEvents ) {
			// Send document only if it was saved or already
			// existed.
			var docId = null;
			var doc = null;
			if( this.editedDocument._id ){
				doc = this.editedDocument;
				docId = doc._id;
			};
			
			this._dispatch({
				type: 'editClosed'
				,docId: docId
				,doc: doc
				,saved: opts.saved
				,inserted: opts.inserted
				,updated: opts.updated
				,deleted: opts.deleted
				,cancelled: opts.cancelled
			});
		};
		
		this.editedDocument = null;
		this.editedFeature = null;
		this.editorContainerId = null;
	}
	
	,refresh: function() {
		this._adjustInternalValues(this.editedDocument);
		if( this.treeEditor ) {
			this.treeEditor.refresh();
		};
		if( this.slideEditor ) {
			this.slideEditor.refresh();
		};
		if( this.schemaEditor ) {
			this.schemaEditor.refresh();
		};
		this._refreshRelations(this.editedDocument);
		this.onEditorObjectChanged(this.editedDocument);
	}
	
	,_adjustInternalValues: function(obj) {
		// BBOX
		if( typeof(OpenLayers) !== 'undefined' ) {
			var geomData = obj[this.options.geomName];
			if( geomData ) {
				// Check if editor has changed the geometry's WKT
				if( this.currentGeometryWkt != geomData.wkt ) {
					$n2.couchGeom.adjustBboxOnCouchGeom(geomData);
				};
			};
		};
	}
	
	,_refreshRelations: function(data){
		var _this = this;
		var $editorContainer = this._getEditorContainer();
		var $displayRelationsDiv = $editorContainer.find('.editorDisplayRelations');
		if( $displayRelationsDiv.length < 1 ) return;

    	var showService = this._getShowService();

    	// Compute relations
		var docIdMap = {};
		if( data 
		 && data.nunaliit_relations
		 && data.nunaliit_relations.length ){
			for(var i=0,e=data.nunaliit_relations.length; i<e; ++i){
				var ref = data.nunaliit_relations[i];
				if( ref.doc ) {
					docIdMap[ref.doc] = true;
				};
			};
		};
		if( data 
		 && data.nunaliit_source
		 && data.nunaliit_source.doc ){
			docIdMap[data.nunaliit_source.doc] = true;
		};
		
		// Remove displayed relations that are no longer valid
		$displayRelationsDiv.find('.editorDisplayRelation').each(function(){
			var $display = $(this);
			var relDocId = $display.attr('nunaliitRelationDocId');
			if( !docIdMap[relDocId] ){
				$display.remove();
			} else {
				// This relDocId is already displayed. Remove from map.
				delete docIdMap[relDocId];
			};
		});
		
		// Function to delete a relation
		var removeRelationFn = function(e){
			var $btn = $(this);
			var $removeRelationDiv = $btn.parents('.editorDisplayRelation');
			if( $removeRelationDiv.length > 0 ){
				var relDocId = $removeRelationDiv.attr('nunaliitRelationDocId');
				_this._removeRelation(relDocId);
				$removeRelationDiv.remove();
			};
			
			return false;
		};
		
		// Add missing relations. At this point, docIdMap contains
		// only missing relations
		for(var relDocId in docIdMap){
			var $displayRelationDiv = $('<div class="editorDisplayRelation"></div>');
			$displayRelationsDiv.append($displayRelationDiv);
			$displayRelationDiv.attr('nunaliitRelationDocId',relDocId);

			$('<span></span>')
				.text( _loc('Relation: '))
				.appendTo($displayRelationDiv);
			
			var $brief = $('<span></span>')
				.text(relDocId)
				.appendTo($displayRelationDiv);
			if( showService ){
				showService.printBriefDescription($brief, relDocId);
			};
			
			$('<button class="editorDisplayRelationButton"></button>')
				.text( _loc('Remove') )
				.appendTo($displayRelationDiv)
				.button({icons:{primary:'ui-icon-trash'}})
				.click(removeRelationFn)
				;
		};
	}
	
	,onEditorObjectChanged: function(obj) {
		var geomData = obj[this.options.geomName];
		
		if( !geomData ) return; // avoid errors
		if( typeof(OpenLayers) === 'undefined' ) return;
			
		// Check if editor has changed the geometry's WKT
		if( this.currentGeometryWkt !== geomData.wkt ) {
		
			this.currentGeometryWkt = geomData.wkt;

			var olGeom = $n2.couchGeom.getOpenLayersGeometry({couchGeom:geomData});
			
			this._dispatch({
				type: 'editGeometryModified'
				,docId: obj._id
				,geom: olGeom
				,proj: this.options.couchProj
				,_origin: this
			});
		};
	}
	
    ,convertFeatureGeometryForDb: function(feature) {
		var mapProj = feature.layer.map.projection;
		if( mapProj.getCode() != this.options.couchProj.getCode() ) {
			// Need to convert
			var geom = feature.geometry.clone();
			geom.transform(mapProj,this.options.couchProj);
			return geom;
		};
		return feature.geometry;
    }
	
	
    ,_featureModified: function(docId, geom, proj) {

		if( proj.getCode() != this.options.couchProj.getCode() ) {
			// Need to convert
			geom = geom.clone();
			geom.transform(proj,this.options.couchProj);
		};
    	
		var geomData = this.editedDocument[this.options.geomName];
		geomData.wkt = geom.toString();
		this.currentGeometryWkt = geomData.wkt;
		if( this.schemaEditor ) {
			this.schemaEditor.refresh();
		};
		if( this.treeEditor ) {
			this.treeEditor.refresh();
		};
		if( this.slideEditor ) {
			this.slideEditor.refresh();
		};
    }
	
	,_addFile: function() {
		var _this = this;
		
		var $attachment = $('#'+_this.editorContainerId).find('.editorAttachFile');
		if( $attachment.length > 0 ) {

			var addFileFormId = $n2.getUniqueId();
			var reportFileNameId = $n2.getUniqueId();
			
			var $addFileDialog = $('<div class="editorAddFileDialog"></div>');

			var $addFileForm = $('<form id="'+addFileFormId+'" class="editorAddFileForm"></form>');
			$addFileDialog.append($addFileForm);
			
			var $table = $('<table></table>');
			$addFileForm.append($table);
			
			// Delete form 
			var $deleteFormTr = $('<tr class="editorAddFileFormEditorLine"><td><button>'+_loc('Remove')+'</button></td><td id="'+reportFileNameId+'"></td></tr>');
			$table.append($deleteFormTr);
			$deleteFormTr.find('button')
				.button({
					icons:{primary:'ui-icon-cancel'}
					,text: false
				})
				.click(function(){
					$('#'+addFileFormId).remove();
					return false;
				});
			
			$table.append('<tr class="editorAddFileFormDialogLine"><td>'+_loc('Title')+':</td><td><input type="text" name="title"/></td></tr>');
			$table.append('<tr class="editorAddFileFormDialogLine"><td>'+_loc('Description')+':</td><td><textarea name="description"></textarea></td></tr>');
			
			var $fileRow = $('<tr class="editorAddFileFormDialogLine"><td>'+_loc('File')+':</td></tr>');
			var $fileTd = $('<td></td>');
			$fileRow.append($fileTd);
			var $fileInput = $('<input class="editorAddFileInput" type="file" name="media"/>');
			$fileTd.append($fileInput);
			$fileInput.change(function(){
				var $fileInput = $(this);
				var filename = $fileInput.val();
				$('#'+reportFileNameId).text(_loc('File')+': '+filename);
			});
			$table.append($fileRow);

			var $btnRow = $('<tr class="editorAddFileFormDialogLine"><td></td></tr>');
			$table.append($btnRow);
			var $btnTd = $('<td></td>');
			$btnRow.append($btnTd);
			
			var $addBtn = $('<button>'+_loc('Attach')+'</button>');
			$btnTd.append($addBtn);
			$addBtn.button({icons:{primary:'ui-icon-plusthick'}});
			$addBtn.click(function(){
				var $addFileForm = $('#'+addFileFormId);
				var $attachment = $('#'+_this.editorContainerId).find('.editorAttachFile');
				$attachment.append($addFileForm);
				$addFileDialog.dialog('close');
				return false;
			});

			var $cancelBtn = $('<button>'+_loc('Cancel')+'</button>');
			$btnTd.append($cancelBtn);
			$cancelBtn.button({icons:{primary:'ui-icon-cancel'}});
			$cancelBtn.click(function(){
				$addFileDialog.dialog('close');
				return false;
			});
			
			var addFileDialogOptions = {
				autoOpen: true
				,title: _loc('Add File')
				,modal: true
				,width: 740
				,close: function(event, ui){
					var diag = $(event.target);
					diag.dialog('destroy');
					diag.remove();
				}
			};
			$addFileDialog.dialog(addFileDialogOptions);
		};
	}
	
	,_getEditorContainer: function() {
		var $editorContainer = $('#'+this.editorContainerId);
		return $editorContainer;
	}
	
	,_disableControls: function() {
		var $editorContainer = this._getEditorContainer();
		$editorContainer.find('button').attr('disabled','disabled');
		$editorContainer.find('input:text').attr('disabled','disabled');
		
		// Do not disable text fields from upload forms, since it does not send
		// the information
		$editorContainer.find('.editorAttachFile').find('input:text').removeAttr('disabled');
	}
	
	,_enableControls: function() {
		var $editorContainer = this._getEditorContainer();
		$editorContainer.find('button').removeAttr('disabled');
		$editorContainer.find('input:text').removeAttr('disabled');
	}
	
	,_getDispatchService: function(){
		var d = null;
		if( this.options && this.options.serviceDirectory ){
			d = this.options.serviceDirectory.dispatchService;
		};
		return d;
	}
	
	,_dispatch: function(m){
		var dispatcher = this._getDispatchService();
		if( dispatcher ){
			dispatcher.send(DH,m);
		};
	}
	
	,_handle: function(m){
		if( m.type === 'editGeometryModified' ){
			if( m._origin !== this ){
				this._featureModified(m.docId, m.geom, m.proj);
			};
		};
	}
});

//++++++++++++++++++++++++++++++++++++++++++++++

var CouchEditor = $n2.Class({

	options: null

	,isFormEditor: null

	,currentEditor: null

	,initialize: function(options_) {
		this.options = $.extend({
			db: null // database must be provided
			,designDoc: null // designDoc must be provided
			,panelName: null // location where editor is opened
			,geomName: 'nunaliit_geom'
			,couchProj: null
			,schema: null
			,defaultEditSchema: null
			,serviceDirectory: null
			,enableAddFile: false
		},options_);
		
		var _this = this;
		
		this.isFormEditor = true;
		
		if( !this.options.couchProj ) {
			this.options.couchProj = getDefaultCouchProjection();
		};
		
		var dispatcher = this._getDispatchService();
		if( dispatcher ){
			var f = function(m){ _this._handle(m); };
			dispatcher.register(DH, 'editGeometryModified', f);
			dispatcher.register(DH, 'editInitiate', f);
			dispatcher.register(DH, 'editCancel', f);
		};
	}

    ,showAttributeForm: function(feature_, editorOptions_) {
    	if( null != this.currentEditor ) {
    		this.currentEditor.performCancellation();
    		this.currentEditor = null;
    	};
    	
    	this.currentEditor = new CouchDocumentEditor(
    		this.options
    		,editorOptions_
    		);
    	this.currentEditor.startFeatureEditing(
    		feature_
    		);
	}

    ,showDocumentForm: function(document_, editorOptions_) {
    	if( null != this.currentEditor ) {
    		this.currentEditor.performCancellation();
    		this.currentEditor = null;
    	};
    	
    	this.currentEditor = new CouchDocumentEditor(
    		this.options
    		,editorOptions_
    		);
    	this.currentEditor.startDocumentEditing(
    		document_
    		);
	}

	,cancelDocumentForm: function(opts) {
    	if( null != this.currentEditor ) {
    		this.currentEditor.performCancellation(opts);
    		this.currentEditor = null;
    	};
	}

	,setPanelName: function(panelName) {
		this.options.panelName = panelName;
	}
	
	,_getDispatchService: function(){
		var d = null;
		if( this.options && this.options.serviceDirectory ){
			d = this.options.serviceDirectory.dispatchService;
		};
		return d;
	}
	
	,_handle: function(m){
		if( 'editInitiate' === m.type ){
			if( m.feature ) {
				this.showAttributeForm(m.feature);
			} else {
				this.showDocumentForm(m.doc);
			};
			
		} else if( 'editCancel' === m.type ) {
			this.cancelDocumentForm();
			
		} else if( null != this.currentEditor ) {
    		this.currentEditor._handle(m);
    	};
	}
});

//++++++++++++++++++++++++++++++++++++++++++++++
// Create an editor based on a schema. This
// performs only the portion that deals with the
// schema.

var SchemaEditor = $n2.Class({

	doc: null
	
	,schema: null
	
	,$div: null
	
	,onChanged: null
	
	,formEditor: null
	
	,postProcessFns: null

	,serviceDirectory: null

	,initialize: function(options_) {
		var options = $.extend({
			doc: null
			,schema: null
			,$div: null
			,onChanged: function(){}
			,funcMap: null
			,postProcessFns: null
			,serviceDirectory: null
		},options_);
		
		var _this = this;
		
		this.doc = options.doc;
		this.schema = options.schema;
		this.$div = options.$div;
		this.onChanged = options.onChanged;
		this.postProcessFns = options.postProcessFns;
		this.serviceDirectory = options.serviceDirectory;
		
		this.formEditor = this.schema.form(
			this.doc
			,this.$div
			,{} // context
			,function(){ // callback on changes
				_this.onChanged();
			}
			,options.funcMap
		);
		
		var showService = this._getShowService();
		if( showService ){
			showService.fixElementAndChildren(this.$div, {}, this.doc);
		};
		
		this._performPostProcess();
	}

	,refresh: function(){
		this.formEditor.refresh();
		
		var showService = this._getShowService();
		if( showService ){
			showService.fixElementAndChildren(this.$div, {}, this.doc);
		};
		
		this._performPostProcess();
	}

	,_performPostProcess: function(){
		
		for(var i=0,e=this.postProcessFns.length; i<e; ++i){
			var fn = this.postProcessFns[i];
			if( typeof(fn) === 'function' ){
				fn(this.doc, this.$div);
			};
		};
	}

	,_getShowService: function(){
		if( this.serviceDirectory 
		 && this.serviceDirectory.showService ) {
			return this.serviceDirectory.showService;
		};
		
		return null;
	}
});

//++++++++++++++++++++++++++++++++++++++++++++++
// Schema editing service. This should be used to set
// attributes that all schema editors should have in
// common.
var _defaultOnChanged = function(){};

var SchemaEditorService = $n2.Class({

	serviceDirectory: null
	
	,funcMap: null
	
	,postProcessFunctions: null
	
	,db: null
	
	,designDoc: null

	,initialize: function(options_) {
		var options = $.extend({
			funcMap: {}
			,postProcessFn: null
			,db: null
			,designDoc: null
			,serviceDirectory: null
		},options_);
	
		var _this = this;
		
		this.serviceDirectory = options.serviceDirectory;
		this.postProcessFunctions = [];
		this.db = options.db;
		this.designDoc = options.designDoc;
		
		this.funcMap = {};
		for(var key in options.funcMap){
			var fn = options.funcMap[key];
			
			if( typeof(fn) === 'function' ){
				this.funcMap[key] = fn;
			};
		};
		
		// Add 'getDocumentId', if not defined
		if( !this.funcMap['getDocumentId'] ){
			this.funcMap['getDocumentId'] = function(cb,resetFn){
				_this._searchForDocumentId(cb,resetFn);
			};			
		};
		if( !this.funcMap['getLayers'] ){
			this.funcMap['getLayers'] = function(currentLayers,cb,resetFn){
				selectLayersDialog({
					currentLayers: currentLayers
					,cb: cb
					,resetFn: resetFn
					,designDoc: _this.designDoc
					,showService: _this._getShowService()
					,dispatchService: _this._getDispatchService()
				});
			};			
		};
		
		if( options.postProcessFn ){
			this.postProcessFunctions.push( options.postProcessFn );
		};
	}

	,editDocument: function(opts_){
		var opts = $n2.extend({
			doc: null // document
			,schema: null // schema that should be used for editing document
			,$div: null // location where editor should be
			,onChanged: _defaultOnChanged
		},opts_);
		
		var editor = new SchemaEditor({
			doc: opts.doc
			,schema: opts.schema
			,$div: opts.$div
			,onChanged: opts.onChanged
			,funcMap: this.funcMap
			,postProcessFns: this.postProcessFunctions
			,serviceDirectory: this.serviceDirectory
		});
		
		return editor;
	}
	
	,addFunctionMap: function(fnName, fn){
		if( typeof(fn) === 'function' ){
			this.funcMap[fnName] = fn;
		};
	}
	
	,addPostProcessFunction: function(fn){
		if( typeof(fn) === 'function' ){
			this.postProcessFunctions.push(fn);
		};
	}

	,_getSearchService: function(){
		if( this.serviceDirectory 
		 && this.serviceDirectory.searchService ) {
			return this.serviceDirectory.searchService;
		};
		
		return null;
	}

	,_getShowService: function(){
		if( this.serviceDirectory 
		 && this.serviceDirectory.showService ) {
			return this.serviceDirectory.showService;
		};
		
		return null;
	}
	
	,_getDispatchService: function(){
		var d = null;
		if( this.serviceDirectory ){
			d = this.serviceDirectory.dispatchService;
		};
		return d;
	}

	,_searchForDocumentId: function(cb,resetFn){
		
		var searchServer = this._getSearchService();
		var showService = this._getShowService();
		
		searchForDocumentId({
			searchServer: searchServer
			,showService: showService
			,onSelected: cb
			,onReset: resetFn
		});
	}
});

$n2.CouchEditor = {
	Editor: CouchEditor
	,SchemaEditorService: SchemaEditorService
	,Constants: {
		ALL_SCHEMAS: {}
	}
};

})(jQuery,nunaliit2);