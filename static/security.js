// security.js - 驗證模組

function validateKSZFile(content, filename) {
  const result = {
    valid: false,
    message: '',
  };

  if (!filename.endsWith('.ksz')) {
    result.message = '錯誤：僅接受副檔名為 .ksz 的檔案。';
    return result;
  }

  const lines = content.split('\n').slice(0, 10);
  const readby = lines.find(line => line.startsWith('//!READBY>>'));
  const signed = lines.find(line => line.startsWith('//!SIGNED>>'));
  const signcode = lines.find(line => line.startsWith('//!SIGNCODE>>'));

  if (!readby || !readby.includes('ksz-reader-v1.2')) {
    result.message = '錯誤：此檔案不是由 KSZ Reader v1.2 所支援。';
    return result;
  }
  if (!signed || !signcode) {
    result.message = '錯誤：檔案未簽章或簽章資訊不完整。';
    return result;
  }

  result.valid = true;
  return result;
}
