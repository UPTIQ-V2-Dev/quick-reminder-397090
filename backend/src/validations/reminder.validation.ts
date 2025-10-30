import Joi from 'joi';

const createReminder = {
    body: Joi.object().keys({
        text: Joi.string().required(),
        dateTime: Joi.string().isoDate().required()
    })
};

const getReminders = {
    query: Joi.object().keys({
        status: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer()
    })
};

const getReminderById = {
    params: Joi.object().keys({
        reminderId: Joi.string().required()
    })
};

const updateReminder = {
    params: Joi.object().keys({
        reminderId: Joi.string().required()
    }),
    body: Joi.object()
        .keys({
            text: Joi.string(),
            dateTime: Joi.string().isoDate(),
            status: Joi.string()
        })
        .min(1)
};

const deleteReminder = {
    params: Joi.object().keys({
        reminderId: Joi.string().required()
    })
};

export default {
    createReminder,
    getReminders,
    getReminderById,
    updateReminder,
    deleteReminder
};
