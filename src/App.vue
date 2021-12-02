<template>
  <div>
    <div>
      <!-- <file-upload
        post-action="http://localhost:5000/api/post"
        v-model="files1"
        ref="upload"
        :chunk-enabled="chunkEnabled"
        :chunk="{
          action: 'http://localhost:5000/api/upload',
          minSize: 1 * 1024,
          maxActive: 3,
          maxRetries: 5,
        }"
        extensions="gif,jpg,jpeg,png,webp"
        accept="image/png,image/gif,image/jpeg,image/webp"
        @input-file="inputFile"
      >
        <i class="fa fa-plus"></i>
        Select files
      </file-upload>
      <button
        type="button"

        v-if="!$refs.upload || !$refs.upload.active"
        @click.prevent="$refs.upload.active = true"
      >
        送信
      </button> -->
    </div>

    <hr />

    <div class="example-multiple">
      <form id="formTest" action="http://localhost:5000/api/post" method="post">
        <input type="text" value="杉山" name="name" />
        <input type="text" value="natsuki@fork.co.jp" name="email" />
        <div class="upload">
          <file-upload
            post-action="http://localhost:5000/api/post"
            v-model="files1"
            ref="upload"
            :chunk-enabled="chunkEnabled"
            :chunk="{
              action: 'http://localhost:5000/api/upload',
              minSize: 1 * 1024,
              maxActive: 3,
              maxRetries: 5,
            }"
            extensions="gif,jpg,jpeg,png,webp"
            accept="image/png,image/gif,image/jpeg,image/webp"
            @input-file="inputFile"
          >
            <i class="fa fa-plus"></i>
            Select files
          </file-upload>
          <button
            type="button"
            v-if="!$refs.upload || !$refs.upload.active"
            @click.prevent="$refs.upload.active = true"
          >
            送信
          </button>
        </div>
        <button type="button" id="uploadAndSubmit" @click="uploadAndSubmit">
          送信
        </button>
      </form>
    </div>
  </div>
</template>


<script>
import FileUpload from "vue-upload-component";
export default {
  components: {
    FileUpload,
  },

  data() {
    return {
      files1: [],
      chunkEnabled: true,
      // 1MB by default
      chunkMinSize: 1,
      chunkMaxActive: 3,
      chunkMaxRetries: 5,
      uploadFinish: false
    };
  },
  methods: {
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file
        // Filter system files or hide files
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent();
        }
        // Filter php html js file
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent();
        }
      }
    },
    inputFile(newFile, oldFile) {
      if (newFile && !oldFile) {
        // add
        console.log("add", newFile);
        // this.$refs.upload.active = true;
      }
      if (newFile && oldFile) {
        // update
        console.log("update", newFile);
        this.uploadFinish = newFile.success
      }
      if (!newFile && oldFile) {
        // remove
        console.log("remove", oldFile);
      }
    },
    async uploadAndSubmit() {
      this.$refs.upload.active = true;
      await new Promise((resolve) => {
        const intervalId = setInterval(function () {
          if (this.uploadFinish) {
            resolve("待機終了");
            clearInterval(intervalId);
          }
        }.bind(this), 5000);
      });
      document.getElementById("formTest").submit();
    },
  },
};
</script>

<style>
.disable-btn {
  display: none;
}
.example-multiple label.btn {
  margin-bottom: 0;
  margin-right: 1rem;
}
.example-multiple .upload {
  margin-bottom: 1rem;
}
.chunk-loading {
  margin: -12px;
  display: flex;
  width: calc(100% + 24px);
}
.chunk-loading .chunk-loading-part {
  height: 25px;
  line-height: 25px;
  flex: 1;
  background: #ccc;
  font-size: 14px;
  color: white;
  text-align: center;
}
.chunk-loading .chunk-loading-part.chunk-loading-part__uploaded {
  background: #28a745;
}
</style>