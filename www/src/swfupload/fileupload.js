var FileUpload;

FileUpload = function(settings){
	this.mergeInitParam(settings);
	this.SWFUpload = new SWFUpload(settings);
};

FileUpload.config = {
	basePath: 'http://118.178.191.111:8081/',
	buttonText: '<span class="theFont">upload</span>'
};

FileUpload.prototype.getSWFUpload = function(){
	return this.SWFUpload;
};

FileUpload.prototype.mergeInitParam = function(settings){
	if(!settings.hasOwnProperty('preserve_relative_urls')){
		settings.preserve_relative_urls  = false;
	}
	if(!settings.hasOwnProperty('upload_url')){
		settings.upload_url  = FileUpload.config.basePath+'fileupload/image';
	}	
	if(!settings.hasOwnProperty('flash_url')){
		settings.flash_url  = FileUpload.config.basePath+'lib/swfupload/swfupload.swf';
	}	
	if(!settings.hasOwnProperty('file_types')){
		settings.file_types  = '*.jpg;*.png';
	}	
	if(!settings.hasOwnProperty('file_size_limit')){
		settings.file_size_limit  = 10*1024*1024;
	}
	if(!settings.hasOwnProperty('file_post_name')){
		settings.file_post_name  = 'file';
	}		
	if(!settings.hasOwnProperty('button_width')){
		settings.button_width = 61;
	}
	if(!settings.hasOwnProperty('button_height')){
		settings.button_height = 22;
	}
	if(!settings.hasOwnProperty('button_placeholder_id')){
		settings.button_placeholder_id = 'SWFUPlaceHolder';
	}
	if(!settings.hasOwnProperty('button_text')){
		settings.button_text = '<span class="theFont">upload</span>';
	}
	if(!settings.hasOwnProperty('button_image_url ')){
		settings.button_image_url  = FileUpload.config.basePath+'lib/swfupload/XPButtonNoText_61x22.png';
	}
	if(!settings.hasOwnProperty('button_text_style')){
		settings.button_text_style = '.theFont { font-size: 16; }';
	}
	if(!settings.hasOwnProperty('button_action')){
		settings.button_action = SWFUpload.BUTTON_ACTION.SELECT_FILE;
	}
	
	if(!settings.hasOwnProperty('file_dialog_start_handler')){
		settings.file_dialog_start_handler = this.fileDialogStartHandler;
	}
	
	if(!settings.hasOwnProperty('file_queued_handler')){
		settings.file_queued_handler = this.fileQueuedHandler;
	}	
	
	if(!settings.hasOwnProperty('file_queue_error_handler')){
		settings.file_queue_error_handler = this.fileQueueErrorHandler;
	}	
	
	if(!settings.hasOwnProperty('upload_start_handler')){
		settings.upload_start_handler = this.uploadStartHandler;
	}
	
	if(!settings.hasOwnProperty('upload_progress_handler')){
		settings.upload_progress_handler = this.uploadProgressHandler;
	}
	
	if(!settings.hasOwnProperty('upload_success_handler')){
		settings.upload_success_handler = this.uploadSuccessHandler;
	}
	
	if(!settings.hasOwnProperty('upload_complete_handler')){
		settings.upload_complete_handler = this.uploadCompleteHandler;
	}	
	
	if(!settings.hasOwnProperty('custom_settings')){
		settings.custom_settings = {};
	}
	
	settings.custom_settings.fileUpload = this;
	
	if(!settings.hasOwnProperty('onStart')){
		settings.custom_settings.onStart = settings.onStart;
	}
	
	if(!settings.hasOwnProperty('onSuccess')){
		settings.custom_settings.onSuccess = settings.onSuccess;
	}	
	
	if(!settings.hasOwnProperty('onComplete')){
		settings.custom_settings.onComplete = settings.onComplete;
	}	
	
};

/**
 * 选择框打开前
 */
FileUpload.prototype.fileDialogStartHandler = function(){
};

/**
 * 选择文件完成后执行此方法
 * @param file
 */
FileUpload.prototype.fileQueuedHandler = function(file){
	// 上传中不能再次选择文件
	if(this.getStats().in_progress) return;
	this.debug('选择文件：'+file.name);
	this.startUpload(file.id);
};

/**
 * 文件上传开始前执行
 * @param file
 */
FileUpload.prototype.uploadStartHandler = function(file){
	this.debug('开始上传，文件：'+file.name);
	this.addFileParam(file.id, "filename", encodeURIComponent(file.name));
	if(this.settings.onStart){
		this.settings.onStart(file);
	}
};

/**
 * 文件上传进度
 * @param file
 * @param complete 已完成数
 * @param total 总数
 */
FileUpload.prototype.uploadProgressHandler = function(file, complete, total){
	this.debug('上传进度，文件：'+file.name+', 已完成：'+complete+', 总共：'+total);
	var progress = Math.round(complete/total*100);
	if(progress == 100){
		this.setButtonText(FileUpload.config.buttonText.replace("upload", 'saving'));
	}else{
		this.setButtonText(FileUpload.config.buttonText.replace("upload", Math.round(complete/total*100)+"%"));
	}
};

/**
 * 文件上传的处理已经完成，获取到服务器返回数据
 * @param file
 * @param data 服务器返回数据
 */
FileUpload.prototype.uploadSuccessHandler = function(file, data){
	this.setButtonText(FileUpload.config.buttonText);
	this.debug('上传完成，文件：'+file.name);
	if(this.settings.onSuccess){
		this.settings.onSuccess(file, eval('('+data+')'));
	}
};

/**
 * 传队列中的一个文件完成了一个上传周期
 * @param file
 * @param data 服务器返回数据
 */
FileUpload.prototype.uploadCompleteHandler = function(file){
	this.setButtonText(FileUpload.config.buttonText);
	if(this.settings.onComplete){
		this.settings.onComplete(file);
	}	
};

/**
 * 只要上传被终止或者没有成功完成，那么该事件都将被触发
 * @param file
 * @param code
 * @param message
 */
FileUpload.prototype.uploadErrorHandler = function(file, code, message){
	switch (code) {
	case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
		this.settings.custom_settings.fileUpload.alert("服务器错误");
		break;
	case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
		this.settings.custom_settings.fileUpload.alert("服务器地址错误");
		break;
	case SWFUpload.UPLOAD_ERROR.IO_ERROR:
		this.settings.custom_settings.fileUpload.alert("IO错误");
		break;
	case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
		this.settings.custom_settings.fileUpload.alert("安全验证错误");
		break;	
	case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
		this.settings.custom_settings.fileUpload.alert("上传文件数受限");
		break;	
	case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
		this.settings.custom_settings.fileUpload.alert("上传失败");
		break;	
	case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
		this.settings.custom_settings.fileUpload.alert("文件标识不存在");
		break;	
	case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
		this.settings.custom_settings.fileUpload.alert("上传的文件不符合要求");
		break;	
	case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
		this.settings.custom_settings.fileUpload.alert("取消上传");
		break;		
	case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
		this.settings.custom_settings.fileUpload.alert("暂停上传");
		break;			
	default:
		break;
	}
};

/**
 * 选择错误的文件的时候执行此方法
 * @param file
 * @param code
 * @param message
 */
FileUpload.prototype.fileQueueErrorHandler = function(file, code, message){
	switch (code) {
	case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
		this.settings.custom_settings.fileUpload.alert('文件超出限制大小');
		break;
	case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
		this.settings.custom_settings.fileUpload.alert('文件类型错误');
		break;
	case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
		this.settings.custom_settings.fileUpload.alert('文件数超出限制');
		break;
	case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
		this.settings.custom_settings.fileUpload.alert('文件为空');
		break;		
	default:
		break;
	}
};

/**
 * 销毁插件
 */
FileUpload.prototype.destroy = function(){
	this.SWFUpload.destroy();
};

/**
 * 弹出提示信息
 * @param message
 */
FileUpload.prototype.alert = function(message){
	alert(message);
};

/**
 * 获取页面是否正在上传
 */
FileUpload.isInProcessing = function(){
	var instances = SWFUpload.instances;
	for(var i in instances){
		if(instances[i].getStats().in_progress){
			return true;
		}
	}
	return false;
};

/**
 * 获取页面是否正在上传
 */
FileUpload.alertIfInProcessing = function(){
	if(FileUpload.isInProcessing()){
		alert('上传操作正在处理中，请稍候操作');
		return false;
	}
	return true;
};
