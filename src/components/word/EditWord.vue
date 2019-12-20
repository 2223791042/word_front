<template>
    <el-dialog
            title="单词修改"
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
                <el-button type="danger" @click="submitForm('wordForm')" icon="el-icon-edit" plain>确认修改</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'

    export default {
        name: "EditWord",
        props: {
            wordForm: {
                id: String,
                english: String,
                pronunciation: String,
                chinese: String
            }
        },
        data() {
            return {
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
            dialogVisible: (state) => state.word.editDialogVisible
        }),
        methods: {
            ...mapMutations({
                changeVisible: 'changeWordEditDialogVisible'
            }),
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.axios.put(`/word/editWord/${this.wordForm.id}`, {
                            english: this.wordForm.english.trim(),
                            pronunciation: this.wordForm.pronunciation.trim(),
                            chinese: this.wordForm.chinese.trim()
                        })
                        .then(response => {
                            let result = response.data;
                            if (result.code === 200) {
                                this.$message({
                                    message: '单词修改成功!',
                                    type: 'success'
                                });
                            } else {
                                this.$message.error(result.msg);
                            }
                        })
                        .catch(error => {
                            this.$message.error(result.msg);
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
