import Template from "../models/Template.js";

export const CreateTemplate = async (req, res) => {
  try {
    const template = req.body.template;
    const newTemplate = Template(template);
    await newTemplate.save();
    res.json({
      success: true,
      message: 'Template created!',
      statusCode: 200,
      data: newTemplate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
      message: 'The system cannot respond, try later!',
      statusCode: 500,
      path: '/create',
    });
  }
};

export const UpdateTemplate = async (req, res) => {
  try {
    const data = req.body.template;
    const templateUpdated = await Template.findByIdAndUpdate(data._id, { $set: { ...data } });
    res.json({
      success: true,
      message: 'response obtained',
      statusCode: 200,
      data: templateUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
      message: 'The system cannot respond, try later!',
      statusCode: 500,
      path: '/update',
    });
  }
};

export const DeleteTemplate = async (req, res) => {
  try {
    const idTemplate = req.body.idTemplate;
    const templateRemoved = await Template.findByIdAndRemove(idTemplate);
    res.json({
      success: true,
      message: 'response obtained',
      statusCode: 200,
      data: templateRemoved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
      message: 'The system cannot respond, try later!',
      statusCode: 500,
      path: '/delete',
    });
  }
};

export const GetTemplatesList = async (req, res) => {
  try {
    const templates = await Template.find({});
    res.json({
      success: true,
      message: 'response obtained',
      statusCode: 200,
      data: templates,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
      message: 'The system cannot respond, try later!',
      statusCode: 500,
      path: '/templateList',
    });
  }
};

export const GetTemplateById = async (req, res) => {
  try {
    const idTemplate = req.body.idTemplate;
    const template = await Template.findById(idTemplate);
    res.json({
      success: true,
      message: 'response obtained',
      statusCode: 200,
      data: template,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
      message: 'The system cannot respond, try later!',
      statusCode: 500,
      path: '/getTemplateById',
    });
  }
};
