<template>
    <el-dialog
            title="单词添加"
            :visible="dialogVisible"
            width="30%"
            :before-close="handleClose">
        <el-form :model="wordForm" :rules="rules" ref="wordForm" label-width="100px">
            <el-form-item label="单词英文" prop="english">
                <el-input v-model="wordForm.english"/>
            </el-form-item>
            <el-form-item label="单词发音" prop="pronunciation">
                <el-input v-model="wordForm.pronunciation"/>
            </el-form-item>
            <el-form-item label="单词解释" prop="chinese">
                <el-input v-model="wordForm.chinese"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('wordForm')" icon="el-icon-plus" plain>立即添加</el-button>
                <el-button @click="resetForm('wordForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'

    export default {
        name: "AddWord",
        data() {
            return {
                wordForm: {
                    english: '',
                    pronunciation: '',
                    chinese: ''
                },
                rules: {
                    english: [
                        {required: true, message: '单词英文不能未空!', trigger: 'blur'}
                    ],
                    pronunciation: [
                        {required: true, message: '英文发音不能未空!', trigger: 'blur'}
                    ],
                    chinese: [
                        {required: true, message: '单词解释不能未空!', trigger: 'blur'}
                    ]
                }
            }
        },
        computed: mapState({
            dialogVisible: (state) => state.word.addDialogVisible
        }),
        methods: {
            ...mapMutations({
                changeVisible: 'changeWordAddDialogVisible'
            }),
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.axios.post('/word/addWord', {
                            english: this.wordForm.english.trim(),
                            pronunciation: this.wordForm.pronunciation.trim(),
                            chinese: this.wordForm.chinese.trim()
                        })
                            .then(response => {
                                let result = response.data;
                                if (result.code === 200) {
                                    this.$message({
                                        message: '单词添加成功!',
                                        type: 'success'
                                    });
                                    this.resetForm('wordForm');
                                } else {
                                    this.$message.error(result.msg);
                                }
                            })
                            .catch(error => {
                                this.$message.error(error);
                            })
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            handleClose(done) {
                this.changeVisible(false);
                done();
            }
        }
    }
</script>

<style scoped>

</style>
