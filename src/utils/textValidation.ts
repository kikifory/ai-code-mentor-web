const INVALID_CHAR_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\uFFFD]/

const FIELD_LABELS = {
  title: '题目标题',
  remark: '备注',
  problemContent: '题目原文',
  code: '代码'
} as const

export type AnalyzeField = keyof typeof FIELD_LABELS

export function hasGarbledText(text: string | null | undefined): boolean {
  if (!text) return false
  return INVALID_CHAR_REGEX.test(text)
}

export function getFieldGarbledError(
  field: AnalyzeField,
  value: string | undefined,
  optional = false
): string {
  if (optional && !value?.trim()) return ''
  if (hasGarbledText(value)) {
    return `${FIELD_LABELS[field]}不能包含乱码或无效字符，请重新输入`
  }
  return ''
}

export interface AnalyzeFormLike {
  title: string
  remark?: string
  problemContent: string
  code: string
}

export function validateAnalyzeForm(form: AnalyzeFormLike): string | null {
  for (const field of ['title', 'problemContent', 'code'] as const) {
    const err = getFieldGarbledError(field, form[field])
    if (err) return err
  }
  if (form.remark?.trim()) {
    const err = getFieldGarbledError('remark', form.remark, true)
    if (err) return err
  }
  return null
}
