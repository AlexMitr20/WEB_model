import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

const generateDocument = (newRequirementNames,newParameters,newCriteriaAssessment,newCriteria, text2) => {
    
    function objectToString(obj) {
        let result = '';

        // Перебираем каждый ключ объекта
        Object.keys(obj).forEach((key, index, array) => {
            // Добавляем имена параметров, разделяя их запятой
            const paramNames = obj[key].map(param => param.name).join(', ');
            
            if (index !== array.length-1) {
                result += paramNames + ', ';
                result += '\n';
            }
            else  result += paramNames;

            
        });

        return result;
    }

    const convertToString = (obj) => {
        return Object.values(obj)
          .map(group => group.map(item => item.value).join(', '))
          .join('\n');
      };
      
    const CriteriaText = convertToString(newCriteriaAssessment);
    const Parameters = objectToString(newParameters);
    const SkillText = objectToString(newCriteria);
    const valuesArray = Object.values(newRequirementNames);
    //console.log(newCriteria);
    const Requirements = ''+ valuesArray.join(", ");
   // console.log(SkillText);
    
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text:`ID: ${text2.id_proj}`,
                                bold: true,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text:`Название проекта: ${text2.name}`,
                                bold: true,
                    }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Требования:`,                                
                                bold: true,
                            }),
                        ],
                    }),
                    ... Requirements.split('\n').map(line => (
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: line,
                                }),
                            ],
                        })
                    )),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Характеристики требований:`,
                                bold: true,
                            }),
                        ],
                    }),
                    ...Parameters.split('\n').map(line => (
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: line,
                                }),
                            ],
                        })
                    )),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Шкалы оценок:`,
                                bold: true,
                            }),
                        ],
                    }),
                    ...SkillText.split('\n').map(line => (
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: line,
                                }),
                            ],
                        })
                    )),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Оценки:`,
                                bold: true,
                            }),
                        ],
                    }),
                    ...CriteriaText.split('\n').map(line => (
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: line,
                                }),
                            ],
                        })
                    )),
                ],
            },
        ],
    });

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, text2.name + ".docx");
    });
};

function SaveDocx(t1, t2, t3, t4, t5) {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Generate Word Document</h1>
                <button onClick={generateDocument(t1, t2, t3, t4, t5)}>Download Word Document</button>
            </header>
        </div>
    );
}

export default SaveDocx;