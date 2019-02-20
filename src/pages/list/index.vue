<template>
  <div class="main flex">
    <Top title="我的足迹"></Top>
    <scroll-view  scroll-y>
      <div class="content">
        <div class="item">
          <image src="https://images.unsplash.com/photo-1550354520-86a81c515d44?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=350&q=20" lazy-load="true" mode="aspectFill"></image>
        </div>
        <div class="item">
          <image src="https://images.unsplash.com/photo-1550537687-75d355fe0eb6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=350&q=20" lazy-load="true" mode="aspectFill"></image>
        </div>
        <div class="item">
          <image src="https://images.unsplash.com/photo-1550332781-aecd27f7434f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=350&q=20" lazy-load="true" mode="aspectFill"></image>
        </div>
        <div class="item">
          <image src="https://images.unsplash.com/photo-1550528669-609a04ba67b9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=350&q=20" lazy-load="true" mode="aspectFill"></image>
        </div>
        <div class="item">
          <image src="https://images.unsplash.com/photo-1550042384-1f83c1aaa981?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=350&q=20" lazy-load="true" mode="aspectFill"></image>
        </div>
        <div class="item">
          <image src="https://images.unsplash.com/photo-1546593064-053d21199be1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=350&q=20" lazy-load="true" mode="aspectFill"></image>
        </div>
        <div class="item">
          <image src="https://images.unsplash.com/photo-1546593064-053d21199be1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=350&q=20" lazy-load="true" mode="aspectFill"></image>
        </div>
    </div>
    </scroll-view>
  </div>
</template>

<script>
  import Top from '../../components/Top'
export default {
    name: 'index',
    components: { Top }
  }
</script>

<style lang="less" scoped>
  .main{
    .content{
      width:100%;
      box-sizing:border-box;
      padding-top:1rem;
      column-count:2;
      column-gap:2px;
      .item{
          display:flex;
          width:100%;
          margin-bottom:2px;
          }
      }
    }
</style>
