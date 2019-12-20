<template>
    <div id="word">
        <div id="choice">
            <el-row :gutter="10">
                <el-col :span="3">
                    <el-button type="primary" icon="el-icon-plus" @click="changeAddDialogVisible(true)" plain>添加单词
                    </el-button>
                </el-col>
                <el-col :span="3">
                    <el-button type="danger" icon="el-icon-delete" @click="delBatch" plain>批量删除</el-button>
                </el-col>
                <el-col :offset="10" :span="8">
                    <el-input placeholder="模糊单词查询" v-model="word" @input="search"/>
                </el-col>
            </el-row>
        </div>
        <el-table
                :data="tableData"
                style="width: 100%"
                height="440"
                @selection-change="handleSelectionChange">
            <el-table-column
                    fixed="left"
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    fixed="left"
                    prop="english"
                    label="单词英文"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="pronunciation"
                    label="英文发音"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="chinese"
                    label="单词解释"
                    width="140">
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="创建时间"
                    width="160">
            </el-table-column>
            <el-table-column
                    prop="updateTime"
                    label="更新时间"
                    width="160">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="200">
                <template slot-scope="scope">
                    <el-button
                            icon="el-icon-edit"
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button
                            icon="el-icon-delete"
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div id="page">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10]"
                    :page-size="5"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
        <add-word-dialog/>
        <edit-word-dialog v-bind:word-form="editForm"/>
    </div>
</template>

<script>
    import AddWordDialog from "../components/word/AddWord";
    import EditWordDialog from "../components/word/EditWord";
    import {mapState, mapMutations} from 'vuex'

    export default {
        name: 'Word',
        data() {
            return {
                tableData: [],
                currentPage: 1,
                total: 1000,
                size: 5,
                word: '',
                editForm: {
                    id: '',
                    english: '',
                    pronunciation: '',
                    chinese: ''
                }
            }
        },
        components: {
            AddWordDialog,
            EditWordDialog
        },
        mounted() {
            this.loadData();
        },
        computed: mapState({
            addDialogVisible: (state) => state.word.addDialogVisible,
            editDialogVisible: (state) => state.word.editDialogVisible
        }),
        watch: {
            addDialogVisible: function (newState, oldState) {
                if (!newState && oldState) {
                    this.loadData();
                }
            },
            editDialogVisible: function (newState, oldState) {
                if (!newState && oldState) {
                    this.loadData();
                }
            }
        },
        methods: {
            delBatch() {
                if (!(this.multipleSelection !== undefined && this.multipleSelection.length !== 0)) {
                    this.$message.error('没有要删除的选项!');
                    return;
                }
                let ids = [];
                let englishList = [];
                this.multipleSelection.forEach(row => {
                    englishList.push(row.english);
                    ids.push(row.id);
                });
                ids = ids.join(",");
                englishList = englishList.join(",");
                this.$confirm(`这些 ${englishList} 单词将被删除?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.axios.delete(`/word/delBatch/${ids}`);
                }).then(response => {
                    let result = response.data;
                    if (result.code === 200) {
                        this.$message({
                            message: '单词删除成功!',
                            type: 'success'
                        });
                        this.loadData();
                    } else {
                        this.$message.error(result.msg);
                    }
                }).catch(error => {
                    if (error !== 'cancel') {
                        this.$message.error(error);
                    }
                })
            },
            ...mapMutations({
                changeAddDialogVisible: 'changeWordAddDialogVisible',
                changeEditDialogVisible: 'changeWordEditDialogVisible'
            }),
            loadData() {
                this.axios.get(`/word/getWordList?page=${this.currentPage}&size=${this.size}&word=${this.word.trim()}`, {})
                    .then(response => {
                        let result = response.data;
                        if (result.code === 200) {
                            let info = result.data;
                            this.currentPage = info.currentPage + 1;
                            this.total = info.total;
                            this.tableData = info.data;
                        }
                    })
                    .catch(error => {
                        this.$message.error(error);
                    });
            },
            search() {
                this.loadData();
            },
            handleClose(done) {
                this.loadData();
                done();
            },
            handleSizeChange(val) {
                this.size = val;
                this.loadData();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.loadData();
            },
            handleEdit(index, row) {
                this.changeEditDialogVisible(true);
                const {id, english, pronunciation, chinese} = {...row};
                this.editForm = {id, english, pronunciation, chinese};
            },
            handleDelete(index, row) {
                this.$confirm(`该 ${row.english} 单词将被删除?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.axios.delete(`/word/delWord/${row.id}`);
                }).then(response => {
                    let result = response.data;
                    if (result.code === 200) {
                        this.$message({
                            message: '单词删除成功!',
                            type: 'success'
                        });
                        this.loadData();
                    } else {
                        this.$message.error(result.msg);
                    }
                }).catch(error => {
                    if (error !== 'cancel') {
                        this.$message.error(error);
                    }
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>
<style scoped>
    #word {
        width: 1000px;
        margin: 0 auto;
    }

    #page {
        margin: 0 auto;
        text-align: center;
    }

    #choice {
        margin-top: 40px;
        margin-bottom: 10px;
    }
</style>
