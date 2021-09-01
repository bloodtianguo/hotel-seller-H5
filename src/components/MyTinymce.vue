<template>
  <div class="tinymce">
    <!-- <h1>tinymce</h1> -->
    <editor id="tinymce" :init="init" v-model="tinymceHtml"></editor>
  </div>
</template>

<script>
import { uploadImg } from "../api/uploadData";
import tinymce from "tinymce/tinymce";
import "tinymce/themes/silver/theme";
import Editor from "@tinymce/tinymce-vue";

import "tinymce/icons/default"; //引入编辑器图标icon，不引入则不显示对应图标
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/paste";
import "tinymce/plugins/wordcount";


// import "tinymce/plugins/contextmenu";
// import "tinymce/plugins/colorpicker";
// import "tinymce/plugins/textcolor";
export default {
  name: "tinymce",
  props: {
    //tinyvalue首先在父组件中定义，用于向本子组件mytinymce发送数据
    //然后在这里声明，用于本子组件接收父组件数据
    tinyvalue: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 子组件的数据变量，默认未父组件传递过来的数据
      tinymceHtml: this.tinyvalue,
      // tinymce默认配置参数，含插件，请注意插件路径，如果错误容易保unexpect token ','之类错误
      init: {
        relative_urls: true,
        language_url: process.env.BASE_URL + "tinymce/zh_CN.js",
        language: "zh_CN",
        skin_url: process.env.BASE_URL + "tinymce/skins/ui/oxide",
        height: 300,
        theme: "silver",
        plugins:
          "link lists image code table   wordcount  paste",
        toolbar:
          "bold italic underline  strikethrough |fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat",
        content_style: "p {margin: 0; padding: 0}",
        branding: false,
        paste_data_images: true,
        // fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        // 增加下面的images_upload_handler对象，能够支持上传图片到服务器
        images_upload_handler: (blobInfo, success, failure) => {
          if (blobInfo.blob().size / 1024 / 1024 > 5) {
            failure("上传失败，图片大小请控制在 5M 以内");
          } else {
            let fdata = new FormData();
            fdata.append("file", blobInfo.blob());

            uploadImg(fdata)
              .then(({ data }) => {
                if (data.code == 0) {
                  success(data.data); //上传成功，在成功函数里填入图片路径
                } else {
                  failure(data.msg);
                }
              })
              .catch(() => {
                // failure('上传失败')
              });
          }
        },
      },
    };
  },
  mounted() {
    //初始化加载配置项
    tinymce.init({
      selector: "#tinymce",
      plugins: "code ax_wordlimit",
      toolbar: "code",
      ax_wordlimit_num: 500,
      ax_wordlimit_callback: function(editor, txt, num) {
        tipsJS("当前字数：" + txt.length + "，限制字数：" + num);
      },
    });
  },
  methods: {},
  //声明最原始的tinymce组件
  components: { Editor },
  watch: {
    //监听内容变化，用于辅助父子组件之间的通讯
    tinyvalue(newValue) {//tinyvalue是父组件代理人，父组件值一旦变化，推送给子组件
      this.tinymceHtml = newValue;
    },
    tinymceHtml(newValue) {
      // let val=newValue.replace(new RegExp(/<p/img), "<p style='margin:0'")
      //tinymceHtml是子组件的值，如果改变，直接反馈给父组件 //tinymceinput是父组件中的用于接收子组件的事件
      this.$emit("tinymceinput", newValue);
    },
  },
};
</script>
