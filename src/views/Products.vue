<template>
  <div class="products">
      <div class="container">
        <div class="intro h-100">
            <div class="row h-100 justify-content-center align-items-center">
              <div class="col-md-6">
                    <h3>Products Page</h3>
                 <p>
                   Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde, ducimus.
                 </p>
              </div>
              <div class="col-md-6">
                  <img src="/img/svg/products.svg" alt="" class="img-fluid">
              </div>
            </div>
          </div>
          <hr>
          <div class="product-test">
            <h3 class="d-inline-block">Products list</h3>
            <button @click="addNew" class="btn btn-primary float-right">Add Product</button>
            <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Modify</th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr v-for="product in products">
                        <td>
                          {{product.name}}
                        </td>
                        <td>
                          {{product.price}}
                        </td>
                        <td>
                          <span class="btn btn-primary btn-sm mr-2" @click="editProduct(product)"><i class="fas fa-edit"></i></span>
                          <span class="btn btn-danger btn-sm" @click="deleteProduct(product)"><i class="fas fa-trash"></i></span>
                        </td>
                      </tr>
                  </tbody>
                </table>
            </div>
          </div>
      </div>
      <!-- Modal -->
      <div class="modal fade" id="product" tabindex="-1" role="dialog" aria-labelledby="editLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editLabel" v-if="modal == 'new'">Add Product</h5>
              <h5 class="modal-title" id="editLabel" v-if="modal == 'edit'">Edit Product</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <div class="row">
                  <!-- main product -->
                  <div class="col-md-8">
                    <div class="form-group">
                      <input type="text" placeholder="Product Name" v-model="product.name" class="form-control">
                    </div>
                    <div class="form-group">
                      <vue-editor v-model="product.description"></vue-editor>
                    </div>
                  </div>
                  <!-- product sidebar -->
                  <div class="col-md-4">
                    <h4 class="display-6">Product Details</h4>
                    <hr>
                    <div class="form-group">
                      <input type="text" placeholder="Product price" v-model="product.price" class="form-control">
                    </div>
                    <div class="form-group">
                      <!-- <input type="text" @keyup.188="addTag" placeholder="Product tags" v-model="tag" class="form-control"> -->
                      <input type="text" @keyup.188="addTag" @keyup.enter="addTag" placeholder="Product tags" v-model="tag" class="form-control">
                      <div  class="d-flex flex-wrap product-tags">
                        <span v-for="(tag, index) in product.tags" :key="index" class="badge badge-pill badge-secondary">{{tag}} <span @click="deleteTag(index)" class="delete-tag" aria-hidden="true">&times;</span> </span>
                        <!-- <p>
                            <span class="p-1">{{tag}},</span>
                        </p> -->
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="product_image">Product Images</label>
                      <!-- <input type="file" @change="uploadImage" class="form-control"> -->
                      <div class="custom-file">
                        <input type="file" @change="uploadImage" class="custom-file-input" id="productImage">
                        <label class="custom-file-label" v-model="prodImage" for="productImage">{{prodImage}}</label>
                      </div>
                    </div>
                    <div class="form-group d-flex">
                      <div class="p-1" v-for="(image, index) in product.images" :key="index">
                          <div class="img-wrapp">
                              <img :src="image" alt="" width="80px">
                              <span class="delete-img" @click="deleteImage(image,index)">&times;</span>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button @click="addProduct()" type="button" class="btn btn-primary" v-if="modal == 'new'">Add Product</button>
              <button @click="updateProduct()" type="button" class="btn btn-primary" v-if="modal == 'edit'">Apply changes</button>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>

import { VueEditor } from "vue2-editor";
import { fb, db} from '../firebase';
export default {
  name: "Products",
  components: {
    VueEditor
  },
  props: {
    msg: String
  },
  data(){
    return {
        products: [],
        product: {
          name:null,
          description:null,
          price:null,
          tags:[],
          images:[]
        },
        activeItem:null,
        modal: null,
        prodImage: "Upload image",
        tag: null
    }
  },
  firestore(){
      return {
        products: db.collection('products'),
      }
  },
  methods:{
    addTag(){
      if(this.product.tags.includes(this.tag)) {
        this.tag = "";
         } else {
           this.product.tags.push(this.tag.indexOf(',') !== -1 ? this.tag.substring(0, this.tag.length - 1) : this.tag);
         this.tag = "";
       }
    },
    deleteTag(index) {
      this.product.tags.splice(index,1);
    },
    deleteImage(img,index){
      let image = fb.storage().refFromURL(img);
      this.product.images.splice(index,1);
      // $('.custom-file-label').html("")
      this.prodImage = "Upload image";
      $('#productImage').val("")
      image.delete().then(function() {
        console.log('image deleted');
      }).catch(function(error) {
        // Uh-oh, an error occurred!
        console.log('an error occurred');
      });
    },
    uploadImage(e){
      if(e.target.files[0]){
          let file = e.target.files[0];
          this.prodImage = file.name;
          var storageRef = fb.storage().ref('products/'+ Math.random() + '_'  + file.name);
          let uploadTask  = storageRef.put(file);
          uploadTask.on('state_changed', (snapshot) => {
          }, (error) => {
            // Handle unsuccessful uploads
          }, () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              this.product.images.push(downloadURL);
            });
          });
      }

    },
    reset(){
      this.product = {
          name:null,
          description:null,
          price:null,
          prodImage:null,
          tags:[],
          images:[]
      }
      $('#productImage').val("")
      this.prodImage = "Upload image";
    },
    addNew(){
        this.modal = 'new';
        this.reset();
        $('#product').modal('show');
    },
    updateProduct(){
        this.$firestore.products.doc(this.product.id).update(this.product);
          Toast.fire({
            type: 'success',
            title: 'Updated successfully'
          })
           $('#product').modal('hide');
    },
    editProduct(product){
      this.modal = 'edit';
      this.product = product;
      $('#product').modal('show');
    },
    deleteProduct(doc){
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          this.$firestore.products.doc(doc.id).delete()
          Toast.fire({
            type: 'success',
            title: 'Deleted  successfully'
          })
        }
      })
    },
    readData(){
    },
    addProduct(){
      this.$firestore.products.add(this.product);
          Toast.fire({
            type: 'success',
            title: 'Product created successfully'
          })
      $('#product').modal('hide');
    }
  },
  created(){
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.img-wrapp{
  position: relative;
  span.delete-img{
position: absolute;
    top: -5px;
    right: -5px;
    background: #6c757d;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    display: flex;
    align-items: center;
    color: #fff;
    justify-content: center;
    transition: all 0.25s;
      &:hover{
        cursor: pointer;
        background: #000000;
      }
  }
}
.product-tags {
  .badge {
    margin: .15rem;
    display: flex;
    align-items: center;
    .delete-tag {
      // font-size: 14px;
      margin-left: 4px;
      transition: all 0.25s;
      cursor: pointer;
      &:hover {
        color: #000000;
        text-shadow: 0.6px 0.3px #fff;
      }
    }
  }
}
</style>
