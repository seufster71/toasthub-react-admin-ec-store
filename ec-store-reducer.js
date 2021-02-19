/*
 * Copyright (C) 2016 The ToastHub Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import reducerUtils from '../../core/common/reducer-utils';

export default function ecstoreReducer(state = {}, action) {
	switch(action.type) {
		case 'LOAD_INIT_EC_STORE': {
			if (action.responseJson != null && action.responseJson.params != null) {
				return Object.assign({}, state, {
					prefTexts: Object.assign({}, state.prefTexts, reducerUtils.getPrefTexts(action)),
					prefLabels: Object.assign({}, state.prefLabels, reducerUtils.getPrefLabels(action)),
					prefOptions: Object.assign({}, state.prefOptions, reducerUtils.getPrefOptions(action)),
					columns: reducerUtils.getColumns(action),
					itemCount: reducerUtils.getItemCount(action),
					items: reducerUtils.getItems(action),
					listLimit: reducerUtils.getListLimit(action),
					listStart: reducerUtils.getListStart(action),
					orderCriteria: [{'orderColumn':'ADMIN_EC_STORE_TABLE_TITLE','orderDir':'ASC'}],
    				searchCriteria: [{'searchValue':'','searchColumn':'ADMIN_EC_STORE_TABLE_TITLE'}],
					paginationSegment: 1,
					selected: null,
					isModifyOpen: false,
					pageName:"ADMIN_EC_STORE",
					isDeleteModalOpen: false,
					errors:null, 
					warns:null, 
					successes:null,
					searchValue:""
				});
			} else {
				return state;
			}
		}
		case 'LOAD_LIST_EC_STORE': {
			if (action.responseJson != null && action.responseJson.params != null) {
				return Object.assign({}, state, {
					itemCount: reducerUtils.getItemCount(action),
					items: reducerUtils.getItems(action),
					listLimit: reducerUtils.getListLimit(action),
					listStart: reducerUtils.getListStart(action),
					paginationSegment: action.paginationSegment,
					selected: null,
					isModifyOpen: false,
					isDeleteModalOpen: false,
					errors:null, 
					warns:null, 
					successes:null
				});
			} else {
				return state;
			}
		}
		case 'EC_STORE_ITEM': {
			if (action.responseJson !=  null && action.responseJson.params != null) {
				// load inputFields
				let inputFields = {};
				let prefForms = reducerUtils.getPrefForms(action);
				for (let i = 0; i < prefForms.ADMIN_EC_STORE_FORM.length; i++) {
					if (prefForms.ADMIN_EC_STORE_FORM[i].group === "FORM1") {
						let classModel = JSON.parse(prefForms.ADMIN_EC_STORE_FORM[i].classModel);
						if (action.responseJson.params.item != null && action.responseJson.params.item.hasOwnProperty(classModel.field)) {
							if (classModel.defaultClazz != null) {
								inputFields[prefForms.ADMIN_EC_STORE_FORM[i].name+"-DEFAULT"] = action.responseJson.params.item[classModel.field].defaultText;
							}
							if (classModel.textClazz != null) {
								for (let j = 0; j < action.responseJson.params.item[classModel.field].langTexts.length; j++) {
									inputFields[prefForms.ADMIN_EC_STORE_FORM[i].name+"-TEXT-"+action.responseJson.params.item[classModel.field].langTexts[j].lang] = action.responseJson.params.item[classModel.field].langTexts[j].text;
								}
							}
							if (classModel.type == "Object") {
								inputFields[prefForms.ADMIN_EC_STORE_FORM[i].name] = "Object";
							} else {
								inputFields[prefForms.ADMIN_EC_STORE_FORM[i].name] = action.responseJson.params.item[classModel.field];
							}
						} else {
							let result = "";
							if (prefForms.ADMIN_EC_STORE_FORM[i].value != null && prefForms.ADMIN_EC_STORE_FORM[i].value != ""){
								if (prefForms.ADMIN_EC_STORE_FORM[i].value.includes("{")) {
									let formValue = JSON.parse(prefForms.ADMIN_EC_STORE_FORM[i].value);
									if (formValue.options != null) {
										for (let j = 0; j < formValue.options.length; j++) {
											if (formValue.options[j] != null && formValue.options[j].defaultInd == true){
												result = formValue.options[j].value;
											}
										}
									} else if (formValue.referPref != null) {
										let pref = action.appPrefs.prefTexts[formValue.referPref.prefName][formValue.referPref.prefItem];
										if (pref != null && pref.value != null && pref.value != "") {
											let value = JSON.parse(pref.value);
											if (value.options != null) {
												for (let j = 0; j < value.options.length; j++) {
													if (value.options[j] != null && value.options[j].defaultInd == true){
														result = value.options[j].value;
													}
												}
											}
										}
									}
								} else {
									result = prefForms.ADMIN_EC_STORE_FORM[i].value;
								}
							}
							inputFields[prefForms.ADMIN_EC_STORE_FORM[i].name] = result;
						}
					}
				}
				// add id if this is existing item
				if (action.responseJson.params.item != null) {
					inputFields.itemId = action.responseJson.params.item.id;
				}
				return Object.assign({}, state, {
					prefForms: Object.assign({}, state.prefForms, reducerUtils.getPrefForms(action)),
					selected : action.responseJson.params.item,
					inputFields : inputFields,
					isModifyOpen: true
				});
			} else {
				return state;
			}
		}
		case 'EC_STORE_INPUT_CHANGE': {
			return reducerUtils.updateInputChange(state,action);
		}
		case 'EC_STORE_LISTLIMIT': {
			return reducerUtils.updateListLimit(state,action);
		}
		case 'EC_STORE_SEARCH': { 
			return reducerUtils.updateSearch(state,action);
		}
		case 'EC_STORE_SEARCH_CHANGE': { 
			return Object.assign({}, state, {
				searchValue: action.value
			});
		}
		case 'EC_STORE_ORDERBY': { 
			return reducerUtils.updateOrderBy(state,action);
		}
		case 'EC_STORE_SET_ERRORS': {
			return Object.assign({}, state, {
				errors: action.errors
			});
		}
		case 'EC_STORE_CLOSE_DELETE_MODAL': {
			return Object.assign({}, state, {
				isDeleteModalOpen: false
			});
		}
		case 'EC_STORE_OPEN_DELETE_MODAL': {
			return Object.assign({}, state, {
				isDeleteModalOpen: true,
				selected: action.item
			});
		}
		default:
			return state;
	}
}

