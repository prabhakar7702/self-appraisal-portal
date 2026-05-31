import * as React from 'react';
import { DefaultButton, Icon, IconButton } from '@fluentui/react';
import { MESSAGES } from '../../constants/Messages';
import { useAppContext } from '../../context/AppContext';
import styles from './DocumentUpload.module.scss';
import { IDocumentUploadProps } from './IDocumentUploadProps';

export const DocumentUpload: React.FC<IDocumentUploadProps> = React.memo((props) => {
  const { documents, addDocument } = useAppContext();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onFileChange = React.useCallback(async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }

    event.currentTarget.value = '';
    const message = await addDocument(file);
    props.onMessage(message || 'Document uploaded successfully.');
  }, [addDocument, props]);

  return (
    <section className={styles.upload}>
      <div>
        <h1>Upload Appraisal Document (PDF)</h1>
        <p>{MESSAGES.UploadOptional}</p>
      </div>
      <div className={styles.uploadPanel}>
        <div className={styles.dropZone}>
          <Icon iconName="CloudUpload" />
          <strong>Drag and drop PDF here</strong>
          <span>Max file size: 5MB. Only PDF allowed.</span>
          <DefaultButton text="Choose File" onClick={() => inputRef.current && inputRef.current.click()} />
          <input ref={inputRef} className={styles.fileInput} type="file" accept="application/pdf,.pdf" onChange={onFileChange} aria-label="Choose appraisal PDF" />
        </div>
        <div className={styles.documentList}>
          {documents.map(document => (
            <article className={styles.documentCard} key={document.id}>
              <Icon iconName="PDF" />
              <div>
                <strong>{document.fileLeafRef}</strong>
                <span>{document.sizeKb} KB</span>
              </div>
              <IconButton ariaLabel={`Remove ${document.fileLeafRef}`} iconProps={{ iconName: 'Cancel' }} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});
